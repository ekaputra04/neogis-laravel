import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head } from "@inertiajs/react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import {
    CoordinatesInterface,
    GeocodingResponseInterface,
    MarkerInterface,
} from "@/types/types";
import axios from "axios";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { centerPoints } from "@/consts/centerPoints";
import { MarkerMap } from "./components/MarkerMap";
import { ElementControls } from "@/Components/ElementControls";
import { ElementList } from "@/Components/ElementList";
import { SearchAddress } from "@/Components/SearchAddress";

const LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL;
const TOKEN = localStorage.getItem("external_api_token") as string;

export default function MapOverviewMarkerComponent() {
    console.log("MAP OVERVIEW MARKER RENDER");

    const [markers, setMarkers] = useState<MarkerInterface[]>([]);
    const [filteredMarkers, setFilteredMarkers] =
        useState<MarkerInterface[]>([]);
    const [address, setAddress] = useState<GeocodingResponseInterface>();
    const [mapCenter, setMapCenter] = useState<CoordinatesInterface>(
        {
            latitude: centerPoints[0],
            longitude: centerPoints[1],
        }
    );
    const [searchValue, setSearchValue] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const fetchMarkers = useCallback(async (): Promise<void> => {
        try {
            const response = await axios.get(`/api/maps/markers`);
            if (response.status == 200) {
                setMarkers(response.data);
                setFilteredMarkers(response.data);
            }
        } catch (error: any) {
            console.error(error.response?.data?.message || error.message);
        }
    }, []);

    const handleDeleted = useCallback(
        async (markerId: number) => {
            setLoading(true);
            try {
                const response = await axios.delete(
                    `/api/maps/markers/${markerId}`
                );
                if (response.status == 200) {
                    await fetchMarkers();
                    toast.success("Marker deleted successfully!");
                } else {
                    toast.success("Failed to delete marker!");
                }
            } catch (error: any) {
                console.error(
                    "Error deleting marker:",
                    error.response?.data?.message || error.message
                );
                toast.error(
                    error.response?.data?.message || "Gagal menghapus marker."
                );
            } finally {
                setLoading(false);
            }
        },
        [fetchMarkers]
    );

    const handleSearch = useCallback((value: string) => {
        setSearchValue(value);
    }, []);

    const handleCenterMap = useCallback((coords: CoordinatesInterface) => {
        setMapCenter({
            latitude: coords.latitude,
            longitude: coords.longitude,
        });
    }, []);

    const handleSelectAddress = useCallback(
        (address: GeocodingResponseInterface) => {
            setAddress(address);
        },
        []
    );

    const handleSetMapCenter = (center: CoordinatesInterface) => {
        setMapCenter(center);
    };

    useEffect(() => {
        if (markers) {
            const filtered = markers.filter((marker) =>
                marker.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredMarkers(filtered);
        } else {
            setFilteredMarkers([]);
        }
    }, [searchValue]);

    useEffect(() => {
        if (address) {
            handleSetMapCenter({
                latitude: Number((address as GeocodingResponseInterface).lat),
                longitude: Number((address as GeocodingResponseInterface).lon),
            });
        }
    }, [address]);

    useEffect(() => {
        const fetchDataMarkers = async () => {
            try {
                const response = await fetch(`${LOCAL_API_URL}/maps/markers`, {
                    headers: { Authorization: `Bearer ${TOKEN}` },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch markers data");
                }

                const data = await response.json();

                console.log("MARKERS", data);

                setMarkers(data);
                setFilteredMarkers(data);
                if (data.length > 0) {

                    const centerPoint = data[0] as MarkerInterface
                    setMapCenter({
                        latitude: Number(centerPoint.latitude),
                        longitude: Number(centerPoint.longitude),
                    })
                }

            } catch (error) {
                console.error("Error fetching markers data:", error);
            }
        };

        Promise.all([
            fetchDataMarkers(),
        ]).catch((error) => {
            console.error("Error fetching initial data:", error);
        });
    }, []);


    return (
        <>
            <DashboardMapLayout currentPath={"/dashboard/marker"}>
                <Head title="Marker" />
                <div className="gap-8 grid md:grid-cols-4">
                    <div className="">
                        <SearchAddress
                            handleSelectAddress={handleSelectAddress}
                            addressId={address?.place_id || 0}
                        />
                        <ElementControls
                            elementType="marker"
                            onSearch={handleSearch}
                            elements={markers}
                        />
                        <ElementList
                            elementLength={markers?.length || 0}
                            loading={loading}
                            filteredElements={filteredMarkers}
                            onCenterMap={handleCenterMap}
                            type="marker"
                        />
                    </div>
                    <div className="z-0 md:col-span-3">
                        <MarkerMap
                            markers={markers}
                            address={address!!}
                            mapCenter={mapCenter}
                            onDelete={handleDeleted}
                        />
                    </div>
                </div>
            </DashboardMapLayout>
        </>
    );
}
