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
    StreetInterface,
    StreetWithCoordinatesInterface,
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
import HowToUseComponent from "@/Components/HowToUseComponent";
import { HowToUseMarkerOverview } from "@/consts/howToUse";
import { useMapLayerStore } from "@/Store/useMapLayerStore";
import { tileLayers } from "@/consts/tileLayers";
import { decode } from "@mapbox/polyline";
import { roundToTwo } from "@/lib/utils";

interface MapOverviewStreetComponentProps {
    streets: StreetInterface[];
}

export default function MapOverviewStreetComponent({
    streets: initialStreets,
}: MapOverviewStreetComponentProps) {
    const { selectedLayer } = useMapLayerStore();
    const [streets, setStreets] = useState<StreetWithCoordinatesInterface[]>(
        initialStreets.map((street) => ({
            ...street,
            coordinates: decode(street.paths).map(([lat, lng]) => [
                lat,
                lng,
            ]) as [number, number][],
        }))
    );

    const [filteredStreets, setFilteredStreets] = useState<
        StreetWithCoordinatesInterface[]
    >(
        initialStreets.map((street) => ({
            ...street,
            coordinates: decode(street.paths).map(([lat, lng]) => [
                lng,
                lat,
            ]) as [number, number][],
        }))
    );
    const [mapCenter, setMapCenter] = useState<CoordinatesInterface>(
        streets && streets.length > 0
            ? {
                  latitude: streets[0].coordinates[0][0],
                  longitude: streets[0].coordinates[0][1],
              }
            : {
                  latitude: centerPoints[0], // fallback jika streets kosong
                  longitude: centerPoints[1],
              }
    );
    const [searchValue, setSearchValue] = useState<string>("");

    const fetchStreets = async (): Promise<void> => {
        try {
            const response = await axios.get(`/api/maps/streets`);
            setStreets(response.data);
        } catch (error: any) {
            console.error(error.response?.data?.message || error.message);
        }
    };

    const handleDeleted = async (streetId: number): Promise<void> => {
        try {
            const response = await axios.delete(
                `/api/maps/streets/${streetId}`
            );
            await fetchStreets();
            toast.success("Street deleted successfully!");
        } catch (error: any) {
            console.error(
                "Error deleting street:",
                error.response?.data?.message || error.message
            );
            toast.error(
                error.response?.data?.message || "Error deleting street."
            );
        }
    };

    useEffect(() => {
        if (streets) {
            const filtered = streets.filter((street) =>
                street.nama_ruas
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
            );
            setFilteredStreets(filtered);
        } else {
            setFilteredStreets([]);
        }
    }, [searchValue, streets]);

    return (
        <>
            <DashboardMapLayout currentPath={"/dashboard/street"}>
                <Head title="Street" />
                <div className="gap-8 grid md:grid-cols-4">
                    <div className="">
                        <HowToUseComponent tutorials={HowToUseMarkerOverview} />

                        <Link href={route("maps.street.add")}>
                            <Button className="mb-4 w-full">
                                <PlusCircle />
                                Add New Street
                            </Button>
                        </Link>
                        <hr />
                        <Input
                            placeholder="Search..."
                            className="my-4"
                            onChange={(e) => setSearchValue(e.target.value)}
                        ></Input>
                        <div className="justify-between w-full h-80 overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="flex justify-between items-center">
                                            <p>Street</p>
                                            <p>
                                                ({filteredStreets.length}/
                                                {streets?.length})
                                            </p>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="block w-full">
                                    {filteredStreets.map((street, index) => (
                                        <TableRow
                                            key={index}
                                            className="block w-full"
                                        >
                                            <TableCell className="flex justify-between items-center">
                                                {street.nama_ruas}
                                                <Button
                                                    variant={"outline"}
                                                    onClick={() =>
                                                        setMapCenter({
                                                            latitude:
                                                                street
                                                                    .coordinates[0][0],
                                                            longitude:
                                                                street
                                                                    .coordinates[0][1],
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
                            zoom={15}
                            style={{ height: "500px", width: "100%" }}
                        >
                            <MapCenterUpdater
                                center={[
                                    mapCenter.latitude,
                                    mapCenter.longitude,
                                ]}
                            />
                            <TileLayer url={tileLayers[selectedLayer]} />

                            {streets &&
                                streets.map((street) => (
                                    <Polyline
                                        key={street.id}
                                        positions={street.coordinates}
                                        color={"blue"}
                                    >
                                        <Popup>
                                            <strong>
                                                {street.nama_ruas ||
                                                    "Jalan Tanpa Nama"}
                                            </strong>
                                            <br />
                                            <br />
                                            {street.keterangan ||
                                                "Tidak ada deskripsi"}
                                            <br />
                                            <br />
                                            Panjang:{" "}
                                            {roundToTwo(street.panjang) ||
                                                "-"}{" "}
                                            meter
                                            <br />
                                            <br />
                                            Lebar: {street.lebar || "-"} meter
                                            <br />
                                            <br />
                                            <Button
                                                className="mr-2"
                                                onClick={() => {
                                                    toast.info(
                                                        "Sedang memproses, mohon tunggu sebentar..."
                                                    );
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
                                                            Are you absolutely
                                                            sure?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot
                                                            be undone. This will
                                                            permanently delete
                                                            street from our
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
                                                                    street.id
                                                                )
                                                            }
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
