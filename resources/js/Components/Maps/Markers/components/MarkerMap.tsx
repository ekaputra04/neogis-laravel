import { memo } from "react";
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
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Badge } from "@/Components/ui/badge";
import { router } from "@inertiajs/react";
import {
    CoordinatesInterface,
    GeocodingResponseInterface,
    MarkerInterface,
} from "@/types/types";
import { MapCenterLayerUpdater } from "@/Components/MapCenterUpdater";
import { TemporaryMarker } from "@/Components/TemporaryMarker";

interface MarkerMapProps {
    markers: MarkerInterface[];
    address: GeocodingResponseInterface;
    mapCenter: CoordinatesInterface;
    onDelete: (id: number) => void;
}

export const MarkerMap = memo(
    ({ markers, address, mapCenter, onDelete }: MarkerMapProps) => {
        console.log("MARKER MAP RENDER");

        return (
            <div className="">
                <MapContainer
                    center={[mapCenter.latitude, mapCenter.longitude]}
                    zoom={16}
                    style={{ height: "500px", width: "100%" }}
                >
                    <MapCenterLayerUpdater
                        mapCenter={mapCenter}
                        address={address!!}
                    />

                    {markers &&
                        markers.map((marker, index) => (
                            <Marker
                                key={index}
                                position={[marker.latitude, marker.longitude]}
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
                                                    Are you absolutely sure?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be
                                                    undone. This will
                                                    permanently delete marker
                                                    from our servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() =>
                                                        onDelete(marker.id)
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
                    <TemporaryMarker />
                </MapContainer>
            </div>
        );
    }
);
