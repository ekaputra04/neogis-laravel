import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head, router } from "@inertiajs/react";
import { useCallback, useMemo, useState } from "react";
import { decode } from "@mapbox/polyline";
import { toast } from "sonner";
import { centerPoints } from "@/consts/centerPoints";
import DashboardCounterCard from "../DashboardCounterCard";
import {
    FilterStateInterface,
    StreetInterface,
    StreetWithCoordinatesInterface,
} from "@/types/types";
import { StreetControls } from "./components/StreetControls";
import { StreetList } from "./components/StreetList";
import { StreetMap } from "./components/StreetMap";
import TableStreetFilterCounter from "./components/TableStreetFilterCounter";
import { Skeleton } from "@/Components/ui/skeleton";
import { Button } from "@/Components/ui/button";
import { Download } from "lucide-react";

interface MapOverviewStreetComponentProps {
    streets: StreetInterface[];
    token: string;
}

export default function MapOverviewStreetComponent({
    streets: initialStreets,
    token,
}: MapOverviewStreetComponentProps) {
    console.log("PARENT STREET OVERVIEW RENDER");

    const [streets, setStreets] = useState<StreetWithCoordinatesInterface[]>(
        () =>
            initialStreets.map((street) => ({
                ...street,
                coordinates: decode(street.paths).map(([lat, lng]) => [
                    lat,
                    lng,
                ]) as [number, number][],
            }))
    );

    const [filters, setFilters] = useState<FilterStateInterface>({
        eksisting: {},
        jenis: {},
        kondisi: {},
    });

    const [mapCenter, setMapCenter] = useState<[number, number]>(
        initialStreets.length > 0
            ? [
                  decode(initialStreets[0].paths)[0][0],
                  decode(initialStreets[0].paths)[0][1],
              ]
            : [centerPoints[0], centerPoints[1]]
    );
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchStreets = useCallback(async () => {
        try {
            const response = await fetch(
                `https://gisapis.manpits.xyz/api/ruasjalan`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
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
    }, [token]);

    const handleDeleted = useCallback(
        async (streetId: number) => {
            setLoading(true);
            try {
                await fetch(
                    `https://gisapis.manpits.xyz/api/ruasjalan/${streetId}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                await fetchStreets();
                toast.success("Street deleted successfully!");
            } catch (error) {
                toast.error("Error deleting street");
            } finally {
                setLoading(false);
            }
        },
        [token, fetchStreets]
    );

    const filteredStreets = useMemo(() => {
        if (!streets) return [];
        const { eksisting, jenis, kondisi } = filters;
        const searchLower = searchValue.toLowerCase();

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

    const handleEditStreet = useCallback((id: number) => {
        toast.info("Processing request...");
        router.visit(`/dashboard/street/edit/${id}`);
    }, []);

    const handleAddNew = useCallback(() => {
        toast.info("Processing request...");
        router.visit("/dashboard/street/add");
    }, []);

    const handleFilterChange = useCallback(
        (newFilters: FilterStateInterface) => {
            setFilters(newFilters);
        },
        []
    );

    const handleSearch = useCallback((value: string) => {
        setSearchValue(value);
    }, []);

    const memoizedCards = useMemo(
        () => (
            <>
                <DashboardCounterCard
                    title="Total Streets"
                    value={initialStreets.length}
                />
                <TableStreetFilterCounter
                    title="Eksisting"
                    streets={initialStreets}
                />
                <TableStreetFilterCounter
                    title="Jenis"
                    streets={initialStreets}
                />
                <TableStreetFilterCounter
                    title="Kondisi"
                    streets={initialStreets}
                />
            </>
        ),
        [initialStreets.length]
    );

    const memoizedMaps = useMemo(
        () => (
            <StreetMap
                streets={streets.map((street) => ({
                    ...street,
                    coordinates: decode(street.paths).map(([lat, lng]) => [
                        lat,
                        lng,
                    ]) as [number, number][],
                }))}
                center={mapCenter}
                onEdit={handleEditStreet}
                onDelete={handleDeleted}
                loading={loading}
            />
        ),
        [initialStreets.length, mapCenter]
    );

    return (
        <DashboardMapLayout currentPath="/dashboard/street">
            <Head title="Street" />

            <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
                {memoizedCards}
            </div>
            <hr />
            <div className="gap-8 grid grid-cols-1 lg:grid-cols-4 mt-8">
                <div>
                    <StreetControls
                        onAddNew={handleAddNew}
                        onFilterChange={handleFilterChange}
                        onSearch={handleSearch}
                        initialFilters={filters}
                        streets={streets}
                    />
                    <StreetList
                        streetLength={streets.length}
                        filteredStreets={filteredStreets}
                        loading={loading}
                        onCenterMap={handleCenterMap}
                    />
                </div>
                <div className="z-0 md:col-span-3">
                    {loading ? (
                        <Skeleton className="w-full h-[500px]" />
                    ) : (
                        memoizedMaps
                    )}
                </div>
            </div>
        </DashboardMapLayout>
    );
}
