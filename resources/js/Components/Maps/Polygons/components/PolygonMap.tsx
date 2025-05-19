import { MapCenterLayerUpdater } from "@/Components/MapCenterUpdater";
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
    CoordinatesInterface,
    GeocodingResponseInterface,
    PolygonInterface,
} from "@/types/types";
import { router } from "@inertiajs/react";
import { memo } from "react";
import { MapContainer, Polygon, Popup } from "react-leaflet";

interface PolygonMapProps {
    polygons: PolygonInterface[];
    address: GeocodingResponseInterface;
    mapCenter: CoordinatesInterface;
    onDelete: (id: number) => void;
}

export const PolygonMap = memo(
    ({ polygons, address, mapCenter, onDelete }: PolygonMapProps) => {
        console.log("POLYGON MAP RENDER");

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

                {polygons &&
                    polygons.map((polygon) => (
                        <Polygon
                            key={polygon.id}
                            positions={polygon.coordinates}
                            color={polygon.color || "blue"}
                        >
                            <Popup>
                                {polygon.name ? (
                                    <strong>{polygon.name}</strong>
                                ) : (
                                    "Lokasi tanpa nama"
                                )}
                                <br />
                                <br />
                                {polygon.description || "Tidak ada deskripsi"}
                                <br />
                                <br />
                                {polygon.category_name && (
                                    <>
                                        <Badge variant={"default"}>
                                            {polygon.category_name}
                                        </Badge>
                                    </>
                                )}
                                <br />
                                <br />
                                <Button
                                    className="mr-2"
                                    onClick={() => {
                                        router.visit(
                                            `/dashboard/polygon/edit/${polygon.id}`
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
                                                polygon from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() =>
                                                    onDelete(polygon.id)
                                                }
                                            >
                                                Continue
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </Popup>
                        </Polygon>
                    ))}
            </MapContainer>
        );
    }
);
