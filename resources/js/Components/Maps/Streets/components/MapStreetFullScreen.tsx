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
import { Button } from "@/Components/ui/button";
import { centerPoints } from "@/consts/centerPoints";
import {
    EksistingJalan,
    JenisJalan,
    KondisiJalan,
} from "@/consts/streetProperties";
import { tileLayerAttributtions, tileLayers } from "@/consts/tileLayers";
import { roundToTwo } from "@/lib/utils";
import { useMapLayerStore } from "@/Store/useMapLayerStore";
import { useStreetLegendStore } from "@/Store/useStreetLegendStore";
import { StreetWithCoordinatesInterface } from "@/types/types";
import { router } from "@inertiajs/react";
import { Minimize } from "lucide-react";
import { MapContainer, Polyline, Popup, TileLayer } from "react-leaflet";
import { toast } from "sonner";
import StreetLegend from "./StreetLegend";

interface MapStreetFullScreenProps {
    streets: StreetWithCoordinatesInterface[];
    mapKey: number;
    onDelete: (id: number) => void;
    handleIsFullScreenChange: (isFullScreen: boolean) => void;
    handleMapKeyChange: () => void;
}

export default function MapStreetFullScreen({
    streets,
    mapKey,
    onDelete,
    handleIsFullScreenChange,
    handleMapKeyChange,
}: MapStreetFullScreenProps) {
    const { type, eksisting, jenis, kondisi } = useStreetLegendStore();
    const { selectedLayer } = useMapLayerStore();

    return (
        <div className="">
            <div className="-z-10 w-screen h-screen">
                <MapContainer
                    key={mapKey}
                    center={
                        streets.length > 0
                            ? [
                                  streets[0].coordinates[0][0],
                                  streets[0].coordinates[0][1],
                              ]
                            : [centerPoints[0], centerPoints[1]]
                    }
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        url={tileLayers[selectedLayer]}
                        attribution={tileLayerAttributtions[selectedLayer]}
                    />
                    {streets.map((street) => {
                        let color = "blue";
                        let weight = 3;
                        if (type === "eksisting") {
                            const match = eksisting.find(
                                (item) => item.id == street.eksisting_id
                            );
                            color = match ? match.color : color;
                            weight = match ? match.weight : weight;
                        } else if (type === "jenis") {
                            const match = jenis.find(
                                (item) => item.id == street.jenisjalan_id
                            );
                            color = match ? match.color : color;
                            weight = match ? match.weight : weight;
                        } else if (type === "kondisi") {
                            const match = kondisi.find(
                                (item) => item.id == street.kondisi_id
                            );
                            color = match ? match.color : color;
                            weight = match ? match.weight : weight;
                        }

                        return (
                            <Polyline
                                key={street.id}
                                positions={street.coordinates}
                                color={color}
                                weight={weight}
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
                                    Panjang: {roundToTwo(street.panjang) ||
                                        "-"}{" "}
                                    meter
                                    <br />
                                    <br />
                                    Lebar: {roundToTwo(street.lebar) ||
                                        "-"}{" "}
                                    meter
                                    <br />
                                    <br />
                                    Eksisting:{" "}
                                    {EksistingJalan.find(
                                        (item) => item.id == street.eksisting_id
                                    )?.eksisting || "-"}
                                    <br />
                                    <br />
                                    Jenis:{" "}
                                    {JenisJalan.find(
                                        (item) =>
                                            item.id == street.jenisjalan_id
                                    )?.jenisjalan || "-"}
                                    <br />
                                    <br />
                                    Kondisi:{" "}
                                    {KondisiJalan.find(
                                        (item) => item.id == street.kondisi_id
                                    )?.kondisi || "-"}
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
                                                    This action cannot be
                                                    undone. This will
                                                    permanently delete street
                                                    from our servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() =>
                                                        onDelete(street.id)
                                                    }
                                                >
                                                    Continue
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </Popup>
                            </Polyline>
                        );
                    })}
                    <TemporaryMarker />
                </MapContainer>
            </div>
            <div className="block top-4 right-4 z-[990] fixed">
                <StreetLegend
                    isFullScreen={true}
                    handleIsFullScreenChange={handleIsFullScreenChange}
                    handleMapKeyChange={handleMapKeyChange}
                />
            </div>
        </div>
    );
}
