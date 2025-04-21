import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head, Link, router } from "@inertiajs/react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { MarkerCoordinatesInterface, MarkerInterface } from "@/types/types";
import { customIcon } from "@/Components/CustomMarkerIcon";
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
import { useEffect, useState } from "react";
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
import HowToUseMarkersOverview from "@/Components/HowToUseMarkersOverview";

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
    const [mapCenter, setMapCenter] = useState<MarkerCoordinatesInterface>(
        markers && markers.length > 0
            ? {
                  latitude: markers[0].latitude,
                  longitude: markers[0].longitude,
              }
            : {
                  latitude: centerPoints[0], // fallback jika markers kosong
                  longitude: centerPoints[1],
              }
    );
    const [searchValue, setSearchValue] = useState<string>("");

    const fetchMarkers = async (): Promise<void> => {
        try {
            const response = await axios.get(`/api/maps/markers`);
            setMarkers(response.data);
        } catch (error: any) {
            console.error(error.response?.data?.message || error.message);
        }
    };

    const handleDeleted = async (markerId: number): Promise<void> => {
        try {
            const response = await axios.delete(
                `/api/maps/markers/${markerId}`
            );
            await fetchMarkers();
            toast.success("Marker berhasil dihapus!");
        } catch (error: any) {
            console.error(
                "Error deleting marker:",
                error.response?.data?.message || error.message
            );
            toast.error(
                error.response?.data?.message || "Gagal menghapus marker."
            );
        }
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
    }, [searchValue, markers]);

    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Maps" />
                <div className="gap-8 grid md:grid-cols-4">
                    <div className="">
                        <HowToUseMarkersOverview />
                        <Link href={route("maps.marker.add")}>
                            <Button className="mb-4 w-full">
                                <PlusCircle />
                                Add New Marker
                            </Button>
                        </Link>
                        <hr />
                        <Input
                            placeholder="Search..."
                            className="my-4"
                            onChange={(e) => setSearchValue(e.target.value)}
                        ></Input>
                        <div className="justify-between w-full h-80 overflow-y-scroll">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="flex justify-between items-center">
                                            <p>Marker</p>
                                            <p>
                                                ({filteredMarkers.length}/
                                                {markers?.length})
                                            </p>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="block w-full">
                                    {filteredMarkers.map((marker, index) => (
                                        <TableRow
                                            key={index}
                                            className="block w-full"
                                        >
                                            <TableCell className="flex justify-between items-center">
                                                {marker.name}
                                                <Button
                                                    variant={"outline"}
                                                    onClick={() =>
                                                        setMapCenter({
                                                            latitude:
                                                                marker.latitude,
                                                            longitude:
                                                                marker.longitude,
                                                        })
                                                    }
                                                >
                                                    <Eye />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <div className="z-0 md:col-span-3">
                        <MapContainer
                            center={[mapCenter.latitude, mapCenter.longitude]}
                            zoom={16}
                            style={{ height: "500px", width: "100%" }}
                        >
                            <MapCenterUpdater
                                center={[
                                    mapCenter.latitude,
                                    mapCenter.longitude,
                                ]}
                            />
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {markers &&
                                markers.map((marker, index) => (
                                    <Marker
                                        key={index}
                                        position={[
                                            marker.latitude,
                                            marker.longitude,
                                        ]}
                                        icon={customIcon}
                                    >
                                        <Popup>
                                            {marker.name ? (
                                                <strong>{marker.name}</strong>
                                            ) : (
                                                "Lokasi tanpa nama"
                                            )}
                                            <br />
                                            <br />
                                            {marker.description ||
                                                "Tidak ada deskripsi"}
                                            <br />
                                            <br />
                                            {marker.category_name && (
                                                <>
                                                    <Badge variant={"default"}>
                                                        {marker.category_name}
                                                    </Badge>
                                                </>
                                            )}
                                            <br />
                                            <br />
                                            <Button
                                                className="mr-2"
                                                onClick={() => {
                                                    router.visit(
                                                        `/dashboard/marker/edit/${marker.id}`
                                                    );
                                                }}
                                                variant={"outline"}
                                            >
                                                Edit
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger className="inline-flex justify-center items-center gap-2 bg-destructive hover:bg-destructive/90 disabled:opacity-50 shadow-sm px-3 py-1 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&_svg]:size-4 font-medium text-destructive-foreground text-sm whitespace-nowrap transition-colors [&_svg]:pointer-events-none disabled:pointer-events-none [&_svg]:shrink-0">
                                                    Delete
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Are you absolutely
                                                            sure?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot
                                                            be undone. This will
                                                            permanently delete
                                                            marker from our
                                                            servers.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                handleDeleted(
                                                                    marker.id
                                                                )
                                                            }
                                                        >
                                                            Continue
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </Popup>
                                    </Marker>
                                ))}
                        </MapContainer>
                    </div>
                </div>
            </DashboardMapLayout>
        </>
    );
}

const MapCenterUpdater = ({ center }: { center: [number, number] }) => {
    const map = useMap();

    useEffect(() => {
        map.flyTo(center, map.getZoom()); // bisa juga pakai map.setView(center, map.getZoom())
    }, [center, map]);

    return null;
};
