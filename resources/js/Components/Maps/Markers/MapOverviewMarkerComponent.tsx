import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head, router } from "@inertiajs/react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { MarkerInterface } from "@/types/types";
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
import { useState } from "react";

export default function MapOverviewMarkerComponent({
    currentPath,
    markers: initialMarkers,
}: {
    currentPath: string;
    markers: MarkerInterface[];
}) {
    const [markers, setMarkers] = useState<MarkerInterface[]>(initialMarkers);

    const fetchMarkers = async (): Promise<void> => {
        try {
            const response = await axios.get(`/api/maps/markers`);
            setMarkers(response.data);
        } catch (error: any) {
            console.error(
                "Error deleting marker:",
                error.response?.data?.message || error.message
            );
            alert(error.response?.data?.message || "Gagal menghapus marker.");
        }
    };

    const handleDeleted = async (markerId: number): Promise<void> => {
        try {
            const response = await axios.delete(
                `/api/maps/markers/${markerId}`
            );
            console.log(response.data.message);
            await fetchMarkers();
            toast.success("Marker berhasil dihapus!");
        } catch (error: any) {
            console.error(
                "Error deleting marker:",
                error.response?.data?.message || error.message
            );
            alert(error.response?.data?.message || "Gagal menghapus marker.");
        }
    };

    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Maps" />
                <div className="">
                    <MapContainer
                        center={[markers[0].latitude, markers[0].longitude]}
                        zoom={15}
                        style={{ height: "500px", width: "100%" }}
                        className="z-10"
                    >
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
                                        {marker.description ||
                                            "Tidak ada deskripsi"}
                                        <br />
                                        <br />
                                        <Button
                                            className="mr-2"
                                            onClick={() => {
                                                router.visit(
                                                    `/maps/marker/edit/${marker.id}`
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
                                                        Are you absolutely sure?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be
                                                        undone. This will
                                                        permanently delete
                                                        marker from our servers.
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
            </DashboardMapLayout>
        </>
    );
}
