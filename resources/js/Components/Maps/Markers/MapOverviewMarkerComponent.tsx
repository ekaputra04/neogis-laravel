import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head } from "@inertiajs/react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { CoordinatesInterface, MarkerInterface } from "@/types/types";
import axios from "axios";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { centerPoints } from "@/consts/centerPoints";
import { MarkerControls } from "./components/MarkerControls";
import { MarkerList } from "./components/MarkerList";
import { MarkerMap } from "./components/MarkerMap";

export default function MapOverviewMarkerComponent({
    currentPath,
    markers: initialMarkers,
}: {
    currentPath: string;
    markers: MarkerInterface[];
}) {
    const [markers, setMarkers] = useState<MarkerInterface[] | null>(
        initialMarkers
    );
    const [filteredMarkers, setFilteredMarkers] =
        useState<MarkerInterface[]>(initialMarkers);
    const [mapCenter, setMapCenter] = useState<CoordinatesInterface>(
        markers && markers.length > 0
            ? {
                  latitude: markers[0].latitude,
                  longitude: markers[0].longitude,
              }
            : {
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
            }
        } catch (error: any) {
            console.error(error.response?.data?.message || error.message);
        }
    }, [initialMarkers]);

    const handleDeleted = useCallback(async (markerId: number) => {
        setLoading(true);
        try {
            const response = await axios.delete(
                `/api/maps/markers/${markerId}`
            );
            if (response.status == 200) {
                await fetchMarkers();
                toast.success("Marker deleted successfully!");
            }
            toast.success("Failed to delete marker!");
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
    }, []);

    useEffect(() => {
        if (markers) {
            const filtered = markers.filter((marker) =>
                marker.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredMarkers(filtered);
        } else {
            setFilteredMarkers([]);
        }
    }, [searchValue, markers]);

    const handleSearch = useCallback((value: string) => {
        setSearchValue(value);
    }, []);

    const handleCenterMap = useCallback((coords: [number, number]) => {
        setMapCenter({
            latitude: coords[0],
            longitude: coords[1],
        });
    }, []);

    console.log("MAP OVERVIEW MARKER RENDER");

    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Marker" />
                <div className="gap-8 grid md:grid-cols-4">
                    <div className="">
                        <MarkerControls onSearch={handleSearch} />
                        <MarkerList
                            filteredMarkers={filteredMarkers}
                            markerlength={markers?.length || 0}
                            loading={loading}
                            onCenterMap={handleCenterMap}
                        />
                    </div>
                    <div className="z-0 md:col-span-3">
                        <MarkerMap
                            markers={markers || []}
                            mapCenter={mapCenter}
                            onDelete={handleDeleted}
                        />
                    </div>
                </div>
            </DashboardMapLayout>
        </>
    );
}
