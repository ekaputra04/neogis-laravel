import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head, router } from "@inertiajs/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { decode } from "@mapbox/polyline";
import { toast } from "sonner";
import { centerPoints } from "@/consts/centerPoints";
import DashboardCounterCard from "../DashboardCounterCard";
import {
    CoordinatesInterface,
    FilterStateInterface,
    GeocodingResponseInterface,
    StreetInterface,
    StreetWithCoordinatesInterface,
} from "@/types/types";
import { StreetControls } from "./components/StreetControls";
import { StreetList } from "./components/StreetList";
import { StreetMap } from "./components/StreetMap";
import { Skeleton } from "@/Components/ui/skeleton";
import { SearchAddress } from "@/Components/SearchAddress";
import { TableStreetFilterCounter } from "./components/TableStreetFilterCounter";
import StreetLegend from "./components/StreetLegend";
import { useStreetLegendStore } from "@/Store/useStreetLegendStore";

const TOKEN = localStorage.getItem("external_api_token") as string;
const API_URL = import.meta.env.VITE_API_URL;

export default function MapOverviewStreetComponent() {
    console.log("PARENT STREET OVERVIEW RENDER");

    const { type } = useStreetLegendStore();

    const [streets, setStreets] = useState<StreetWithCoordinatesInterface[]>(
        []
    );
    const [selectedStreet, setSelectedStreet] =
        useState<StreetWithCoordinatesInterface | null>();
    const [address, setAddress] = useState<GeocodingResponseInterface>();
    const [filters, setFilters] = useState<FilterStateInterface>({
        eksisting: {
            "1": true,
            "2": true,
            "3": true,
            "4": true,
            "5": true,
            "6": true,
            "7": true,
            "8": true,
            "9": true,
        },
        jenis: { "1": true, "2": true, "3": true },
        kondisi: { "1": true, "2": true, "3": true },
    });
    const [mapCenter, setMapCenter] = useState<[number, number]>([
        centerPoints[0],
        centerPoints[1],
    ]);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [mapKey, setMapKey] = useState(0);

    const fetchStreets = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/ruasjalan`, {
                headers: { Authorization: `Bearer ${TOKEN}` },
            });
            const { ruasjalan } = await response.json();
            setStreets(
                ruasjalan.map((street: StreetInterface) => ({
                    ...street,
                    coordinates: decode(street.paths).map(([lat, lng]) => [
                        lat,
                        lng,
                    ]),
                }))
            );
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }, []);

    const handleDeleted = useCallback(
        async (streetId: number) => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${API_URL}/ruasjalan/${streetId}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${TOKEN}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to delete street");
                }

                await fetchStreets();
                toast.success("Street deleted successfully!");
            } catch (error) {
                toast.error("Error deleting street");
            } finally {
                setLoading(false);
            }
        },
        [fetchStreets]
    );

    const filteredStreets = useMemo(() => {
        if (!streets) return [];
        const { eksisting, jenis, kondisi } = filters;
        const searchLower = searchValue.toLowerCase();

        const allFiltersFalse =
            !Object.values(eksisting).some(Boolean) &&
            !Object.values(jenis).some(Boolean) &&
            !Object.values(kondisi).some(Boolean);

        if (allFiltersFalse) return [];

        return streets.filter((street) => {
            const eksistingMatch =
                !Object.values(eksisting).some(Boolean) ||
                eksisting[street.eksisting_id];
            const jenisMatch =
                !Object.values(jenis).some(Boolean) ||
                jenis[street.jenisjalan_id];
            const kondisiMatch =
                !Object.values(kondisi).some(Boolean) ||
                kondisi[street.kondisi_id];
            const nameMatch = street.nama_ruas
                .toLowerCase()
                .includes(searchLower);

            return eksistingMatch && jenisMatch && kondisiMatch && nameMatch;
        });
    }, [streets, filters, searchValue]);

    const handleCenterMap = useCallback((coords: [number, number]) => {
        setMapCenter(coords);
    }, []);

    const handleSelectedStreet = useCallback(
        (street: StreetWithCoordinatesInterface) => {
            setSelectedStreet(street);
        },
        []
    );

    const handleFilterChange = useCallback(
        (newFilters: FilterStateInterface) => {
            setFilters(newFilters);
        },
        []
    );

    const handleSearch = useCallback((value: string) => {
        setSearchValue(value);
    }, []);

    const handleSelectAddress = useCallback(
        (address: GeocodingResponseInterface) => {
            setAddress(address);
        },
        []
    );

    const handleSetMapCenter = (center: CoordinatesInterface) => {
        setMapCenter([center.latitude, center.longitude]);
    };

    useEffect(() => {
        if (address) {
            handleSetMapCenter({
                latitude: Number((address as GeocodingResponseInterface).lat),
                longitude: Number((address as GeocodingResponseInterface)?.lon),
            });
        }
    }, [address]);

    useEffect(() => {
        setMapKey((prevKey) => prevKey + 1);
    }, [filteredStreets, type]);

    useEffect(() => {
        const fetchDataStreets = async () => {
            try {
                const response = await fetch(`${API_URL}/ruasjalan`, {
                    headers: { Authorization: `Bearer ${TOKEN}` },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch locations data");
                }

                const data = await response.json();

                const streets: StreetWithCoordinatesInterface[] = (
                    data.ruasjalan as StreetInterface[]
                ).map((street) => {
                    return {
                        ...street,
                        coordinates: decode(street.paths).map(([lat, lng]) => [
                            lat,
                            lng,
                        ]),
                    };
                });

                setStreets(streets);

                const decoded = decode(data.ruasjalan[0].paths);
                const coordinates = decoded.map(([latitude, longitude]) => ({
                    latitude,
                    longitude,
                }));

                setMapCenter([
                    coordinates[0].latitude,
                    coordinates[1].longitude,
                ]);
            } catch (error) {
                console.error("Error fetching streets data:", error);
            }
        };

        Promise.all([fetchDataStreets()]).catch((error) => {
            console.error("Error fetching initial data:", error);
        });
    }, []);

    return (
        <DashboardMapLayout currentPath="/dashboard/street">
            <Head title="Street" />

            <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <DashboardCounterCard
                    title="Total Streets"
                    value={streets.length}
                />
                <TableStreetFilterCounter title="Eksisting" streets={streets} />
                <TableStreetFilterCounter title="Jenis" streets={streets} />
                <TableStreetFilterCounter title="Kondisi" streets={streets} />
            </div>
            <hr />
            <div className="gap-8 grid grid-cols-1 lg:grid-cols-4 mt-8">
                <div>
                    <SearchAddress
                        handleSelectAddress={handleSelectAddress}
                        addressId={address?.place_id || 0}
                    />
                    <StreetControls
                        onFilterChange={handleFilterChange}
                        onSearch={handleSearch}
                        initialFilters={filters}
                        streets={filteredStreets}
                    />
                    <StreetList
                        streetLength={streets.length}
                        filteredStreets={filteredStreets}
                        loading={loading}
                        selectedStreet={selectedStreet!!}
                        handleCenterMap={handleCenterMap}
                        handleSelectedStreet={handleSelectedStreet}
                    />
                </div>
                <div className="z-0 md:col-span-3">
                    <StreetLegend />
                    <hr className="my-4" />
                    {loading ? (
                        <Skeleton className="w-full h-[500px]" />
                    ) : (
                        <StreetMap
                            key={mapKey}
                            streets={filteredStreets}
                            onDelete={handleDeleted}
                            loading={loading}
                            address={address!!}
                            mapCenter={mapCenter}
                        />
                    )}
                </div>
            </div>
        </DashboardMapLayout>
    );
}
