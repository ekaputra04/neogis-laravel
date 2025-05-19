import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head, router } from "@inertiajs/react";
import { MapContainer, Polygon, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import {
    CoordinatesInterface,
    GeocodingResponseInterface,
    PolygonInterface,
} from "@/types/types";
import { Button } from "@/Components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import axios from "axios";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { centerPoints } from "@/consts/centerPoints";
import { Badge } from "@/Components/ui/badge";
import { useMapLayerStore } from "@/Store/useMapLayerStore";
import { tileLayers } from "@/consts/tileLayers";
import { MapCenterUpdater } from "@/Components/MapCenterUpdater";
import { SearchAddress } from "@/Components/SearchAddress";
import { ElementControls } from "@/Components/ElementControls";
import { ElementList } from "@/Components/ElementList";
import { PolygonMap } from "./components/PolygonMap";

interface MapOverviewPolygonComponentProps {
    polygons: PolygonInterface[];
}

export default function MapOverviewPolygonComponent({
    polygons: initialPolygons,
}: MapOverviewPolygonComponentProps) {
    const { selectedLayer } = useMapLayerStore();
    const [polygons, setPolygons] =
        useState<PolygonInterface[]>(initialPolygons);
    const [filteredPolygons, setFilteredPolygons] =
        useState<PolygonInterface[]>(initialPolygons);
    const [searchValue, setSearchValue] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState<GeocodingResponseInterface>();
    const [mapCenter, setMapCenter] = useState<CoordinatesInterface>(
        polygons && polygons.length > 0
            ? {
                  latitude: polygons[0].coordinates[0][0],
                  longitude: polygons[0].coordinates[0][1],
              }
            : {
                  latitude: centerPoints[0],
                  longitude: centerPoints[1],
              }
    );

    const fetchPolygons = useCallback(async (): Promise<void> => {
        try {
            const response = await axios.get(`/api/maps/polygons`);
            setPolygons(response.data);
        } catch (error: any) {
            console.error(error.response?.data?.message || error.message);
        }
    }, [initialPolygons]);

    const handleDeleted = useCallback(
        async (polygonId: number): Promise<void> => {
            setLoading(true);
            try {
                const response = await axios.delete(
                    `/api/maps/polygons/${polygonId}`
                );
                if (response.status == 200) {
                    await fetchPolygons();
                    toast.success("Polygon deleted successfully!");
                } else {
                    toast.error("Error deleting polygon.");
                }
            } catch (error: any) {
                console.error(
                    "Error deleting polygon:",
                    error.response?.data?.message || error.message
                );
                toast.error(
                    error.response?.data?.message || "Error deleting polygon."
                );
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const handleSelectAddress = useCallback(
        (address: GeocodingResponseInterface) => {
            setAddress(address);
        },
        []
    );

    const handleSetMapCenter = (center: CoordinatesInterface) => {
        setMapCenter(center);
    };

    const handleCenterMap = useCallback((coords: CoordinatesInterface) => {
        setMapCenter({
            latitude: coords.latitude,
            longitude: coords.longitude,
        });
    }, []);

    useEffect(() => {
        if (address) {
            handleSetMapCenter({
                latitude: Number((address as GeocodingResponseInterface).lat),
                longitude: Number((address as GeocodingResponseInterface)?.lon),
            });
        }
    }, [address]);

    useEffect(() => {
        if (polygons) {
            const filtered = polygons.filter((marker) =>
                marker.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredPolygons(filtered);
        } else {
            setFilteredPolygons([]);
        }
    }, [searchValue]);

    return (
        <>
            <DashboardMapLayout currentPath={"/dashboard/polygon"}>
                <Head title="Polygon" />
                <div className="gap-8 grid md:grid-cols-4">
                    <div className="">
                        <SearchAddress
                            handleSelectAddress={handleSelectAddress}
                            addressId={address?.place_id || 0}
                        />
                        <ElementControls
                            elementType="polygon"
                            elements={polygons}
                            onSearch={setSearchValue}
                        />
                        <ElementList
                            elementLength={polygons?.length || 0}
                            loading={loading}
                            filteredElements={filteredPolygons}
                            onCenterMap={handleCenterMap}
                            type="polygon"
                        />
                    </div>
                    <div className="z-0 md:col-span-3">
                        <PolygonMap
                            polygons={polygons}
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
