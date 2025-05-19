import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    MapContainer,
    Polyline,
    Popup,
    TileLayer,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import {
    CoordinatesInterface,
    GeocodingResponseInterface,
    LineInterface,
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
import { ElementControls } from "@/Components/ElementControls";
import { SearchAddress } from "@/Components/SearchAddress";
import { ElementList } from "@/Components/ElementList";
import { LineMap } from "./components/LineMap";

interface MapOverviewLineComponentProps {
    currentPath: string;
    lines: LineInterface[];
}

export default function MapOverviewLineComponent({
    currentPath,
    lines: initialLines,
}: MapOverviewLineComponentProps) {
    const [lines, setLines] = useState<LineInterface[]>(initialLines);
    const [filteredLines, setFilteredLines] =
        useState<LineInterface[]>(initialLines);
    const [mapCenter, setMapCenter] = useState<CoordinatesInterface>(
        lines && lines.length > 0
            ? {
                  latitude: lines[0].coordinates[0][0],
                  longitude: lines[0].coordinates[0][1],
              }
            : {
                  latitude: centerPoints[0],
                  longitude: centerPoints[1],
              }
    );
    const [searchValue, setSearchValue] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState<GeocodingResponseInterface>();

    const fetchlines = useCallback(async () => {
        try {
            const response = await axios.get(`/api/maps/lines`);
            if (response.status == 200) {
                setLines(response.data);
            }
        } catch (error: any) {
            console.error(error.response?.data?.message || error.message);
        }
    }, [initialLines]);

    const handleDeleted = useCallback(async (lineId: number) => {
        setLoading(true);
        try {
            const response = await axios.delete(`/api/maps/lines/${lineId}`);
            if (response.status == 200) {
                await fetchlines();
                toast.success("Line deleted successfully!");
            } else {
                toast.error("Error deleting line.");
            }
        } catch (error: any) {
            console.error(
                "Error deleting line:",
                error.response?.data?.message || error.message
            );
            toast.error(
                error.response?.data?.message || "Error deleting line."
            );
        } finally {
            setLoading(false);
        }
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
        if (lines) {
            const filtered = lines.filter((marker) =>
                marker.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredLines(filtered);
        } else {
            setFilteredLines([]);
        }
    }, [searchValue]);

    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Line" />
                <div className="gap-8 grid md:grid-cols-4">
                    <div className="">
                        <SearchAddress
                            handleSelectAddress={handleSelectAddress}
                            addressId={address?.place_id || 0}
                        />
                        <ElementControls
                            elementType="line"
                            elements={lines || []}
                            onSearch={setSearchValue}
                        />
                        <ElementList
                            elementLength={lines?.length || 0}
                            loading={loading}
                            filteredElements={filteredLines}
                            onCenterMap={handleCenterMap}
                            type="line"
                        />
                    </div>
                    <div className="z-0 md:col-span-3">
                        <LineMap
                            lines={lines}
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
