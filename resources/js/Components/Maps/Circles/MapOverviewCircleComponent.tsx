import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Circle,
    MapContainer,
    Polygon,
    Popup,
    TileLayer,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import {
    CircleInterface,
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
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Eye, PlusCircle } from "lucide-react";
import { centerPoints } from "@/consts/centerPoints";
import { Badge } from "@/Components/ui/badge";
import HowToUseComponent from "@/Components/HowToUseComponent";
import { HowToUseMarkerOverview } from "@/consts/howToUse";
import { useMapLayerStore } from "@/Store/useMapLayerStore";
import { tileLayers } from "@/consts/tileLayers";
import { MapCenterUpdater } from "@/Components/MapCenterUpdater";
import { SearchAddress } from "@/Components/SearchAddress";
import { ElementControls } from "@/Components/ElementControls";
import { ElementList } from "@/Components/ElementList";
import { CircleMap } from "./components/CircleMap";

interface MapOverviewCircleComponentProps {
    currentPath: string;
    circles: CircleInterface[];
}

export default function MapOverviewCircleComponent({
    currentPath,
    circles: initialCircles,
}: MapOverviewCircleComponentProps) {
    const { selectedLayer } = useMapLayerStore();
    const [circles, setCircles] = useState<CircleInterface[]>(initialCircles);
    const [filteredCircles, setFilteredCircles] =
        useState<CircleInterface[]>(initialCircles);
    const [searchValue, setSearchValue] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState<GeocodingResponseInterface>();
    const [mapCenter, setMapCenter] = useState<CoordinatesInterface>(
        circles && circles.length > 0
            ? {
                  latitude: circles[0].latitude,
                  longitude: circles[0].longitude,
              }
            : {
                  latitude: centerPoints[0], // fallback jika circles kosong
                  longitude: centerPoints[1],
              }
    );

    const fetchCircles = useCallback(async (): Promise<void> => {
        try {
            const response = await axios.get(`/api/maps/circles`);
            if (response.status == 200) {
                setCircles(response.data);
            }
        } catch (error: any) {
            console.error(error.response?.data?.message || error.message);
        }
    }, [initialCircles]);

    const handleDeleted = useCallback(
        async (circleId: number): Promise<void> => {
            try {
                const response = await axios.delete(
                    `/api/maps/circles/${circleId}`
                );
                if (response.status == 200) {
                    await fetchCircles();
                    toast.success("Circle deleted successfully!");
                } else {
                    toast.success("Failed to delete circle!");
                }
            } catch (error: any) {
                console.error(
                    "Error deleting circle:",
                    error.response?.data?.message || error.message
                );
                toast.error(
                    error.response?.data?.message || "Error deleting circle."
                );
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
        if (circles) {
            const filtered = circles.filter((marker) =>
                marker.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredCircles(filtered);
        } else {
            setFilteredCircles([]);
        }
    }, [searchValue]);

    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Circle" />
                <div className="gap-8 grid md:grid-cols-4">
                    <div className="">
                        <SearchAddress
                            handleSelectAddress={handleSelectAddress}
                            addressId={address?.place_id || 0}
                        />
                        <ElementControls
                            elementType="circle"
                            elements={circles}
                            onSearch={setSearchValue}
                        />
                        <ElementList
                            elementLength={circles?.length || 0}
                            loading={loading}
                            filteredElements={filteredCircles}
                            onCenterMap={handleCenterMap}
                            type="circle"
                        />
                    </div>
                    <div className="z-0 md:col-span-3">
                        <CircleMap
                            circles={circles}
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
