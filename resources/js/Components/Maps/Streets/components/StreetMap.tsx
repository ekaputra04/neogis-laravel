import { MapContainer, Polyline, Popup } from "react-leaflet";
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
import { roundToTwo } from "@/lib/utils";
import {
    GeocodingResponseInterface,
    StreetWithCoordinatesInterface,
} from "@/types/types";
import { memo } from "react";
import { Skeleton } from "@/Components/ui/skeleton";
import { MapCenterLayerUpdater } from "@/Components/MapCenterUpdater";
import { toast } from "sonner";
import { router } from "@inertiajs/react";

interface StreetMapProps {
    streets: StreetWithCoordinatesInterface[];
    onDelete: (id: number) => void;
    loading: boolean;
    address: GeocodingResponseInterface;
    mapCenter: [number, number];
}

export const StreetMap = memo(
    ({ streets, onDelete, loading, address, mapCenter }: StreetMapProps) => {
        if (loading) return <Skeleton className="w-full h-[500px]" />;
        console.log("STREET MAP RENDER");

        return (
            <MapContainer
                center={mapCenter}
                zoom={15}
                style={{ height: "500px", width: "100%" }}
            >
                <MapCenterLayerUpdater
                    address={address!!}
                    mapCenter={{
                        latitude: mapCenter[0],
                        longitude: mapCenter[1],
                    }}
                />

                {streets.map((street) => (
                    <Polyline
                        key={street.id}
                        positions={street.coordinates}
                        color={"blue"}
                    >
                        <Popup>
                            <strong>
                                {street.nama_ruas || "Jalan Tanpa Nama"}
                            </strong>
                            <br />
                            <br />
                            {street.keterangan || "Tidak ada deskripsi"}
                            <br />
                            <br />
                            Panjang: {roundToTwo(street.panjang) || "-"} meter
                            <br />
                            <br />
                            Lebar: {street.lebar || "-"} meter
                            <br />
                            <br />
                            <Button
                                className="mr-2"
                                onClick={() => {
                                    toast.info("Processing request...");
                                    router.visit(
                                        `/dashboard/street/edit/${street.id}`
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
                                            This action cannot be undone. This
                                            will permanently delete street from
                                            our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => onDelete(street.id)}
                                        >
                                            Continue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </Popup>
                    </Polyline>
                ))}
            </MapContainer>
        );
    }
);
