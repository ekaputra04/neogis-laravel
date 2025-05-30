import { MapCenterLayerUpdater } from "@/Components/MapCenterUpdater";
import { TemporaryMarker } from "@/Components/TemporaryMarker";
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
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    CircleInterface,
    CoordinatesInterface,
    GeocodingResponseInterface,
} from "@/types/types";
import { router } from "@inertiajs/react";
import { memo } from "react";
import { Circle, MapContainer, Popup } from "react-leaflet";

interface CircleMapProps {
    circles: CircleInterface[];
    address: GeocodingResponseInterface;
    mapCenter: CoordinatesInterface;
    onDelete: (id: number) => void;
}

export const CircleMap = memo(
    ({ circles, address, mapCenter, onDelete }: CircleMapProps) => {
        console.log("CIRCLE MAP RENDER");

        return (
            <MapContainer
                center={[mapCenter.latitude, mapCenter.longitude]}
                zoom={13}
                style={{ height: "500px", width: "100%" }}
            >
                <MapCenterLayerUpdater
                    address={address!!}
                    mapCenter={{
                        latitude: mapCenter.latitude,
                        longitude: mapCenter.longitude,
                    }}
                />

                {circles &&
                    circles.map((circle) => (
                        <Circle
                            key={circle.id}
                            center={[circle.latitude, circle.longitude]}
                            radius={circle.radius}
                            color={circle.color || "blue"}
                        >
                            <Popup>
                                {circle.name ? (
                                    <strong>{circle.name}</strong>
                                ) : (
                                    "Lokasi tanpa nama"
                                )}
                                <br />
                                <br />
                                {circle.description || "Tidak ada deskripsi"}
                                <br />
                                <br />
                                {circle.category_name && (
                                    <>
                                        <Badge variant={"default"}>
                                            {circle.category_name}
                                        </Badge>
                                    </>
                                )}
                                <br />
                                <br />
                                <Button
                                    className="mr-2"
                                    onClick={() => {
                                        router.visit(
                                            `/dashboard/circle/edit/${circle.id}`
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
                                                This action cannot be undone.
                                                This will permanently delete
                                                circle from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() =>
                                                    onDelete(circle.id)
                                                }
                                            >
                                                Continue
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </Popup>
                        </Circle>
                    ))}
                <TemporaryMarker />
            </MapContainer>
        );
    }
);
