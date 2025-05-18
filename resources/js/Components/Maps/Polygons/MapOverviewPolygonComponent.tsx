import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head, Link, router } from "@inertiajs/react";
import { MapContainer, Polygon, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { CoordinatesInterface, PolygonInterface } from "@/types/types";
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
import { MapCenterUpdater } from "@/Components/MapCenterUpdater";

interface MapOverviewPolygonComponentProps {
    currentPath: string;
    polygons: PolygonInterface[];
}

export default function MapOverviewPolygonComponent({
    currentPath,
    polygons: initialPolygons,
}: MapOverviewPolygonComponentProps) {
    const { selectedLayer } = useMapLayerStore();
    const [polygons, setPolygons] = useState<PolygonInterface[] | null>(
        initialPolygons
    );
    const [filteredPolygons, setFilteredPolygons] =
        useState<PolygonInterface[]>(initialPolygons);
    const [mapCenter, setMapCenter] = useState<CoordinatesInterface>(
        polygons && polygons.length > 0
            ? {
                  latitude: polygons[0].coordinates[0][0],
                  longitude: polygons[0].coordinates[0][1],
              }
            : {
                  latitude: centerPoints[0], // fallback jika polygons kosong
                  longitude: centerPoints[1],
              }
    );
    const [searchValue, setSearchValue] = useState<string>("");

    const fetchPolygons = async (): Promise<void> => {
        try {
            const response = await axios.get(`/api/maps/polygons`);
            setPolygons(response.data);
        } catch (error: any) {
            console.error(error.response?.data?.message || error.message);
        }
    };

    const handleDeleted = async (polygonId: number): Promise<void> => {
        try {
            const response = await axios.delete(
                `/api/maps/polygons/${polygonId}`
            );
            await fetchPolygons();
            toast.success("Polygon deleted successfully!");
        } catch (error: any) {
            console.error(
                "Error deleting polygon:",
                error.response?.data?.message || error.message
            );
            toast.error(
                error.response?.data?.message || "Error deleting polygon."
            );
        }
    };

    useEffect(() => {
        if (polygons) {
            const filtered = polygons.filter((marker) =>
                marker.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredPolygons(filtered);
        } else {
            setFilteredPolygons([]);
        }
    }, [searchValue, polygons]);

    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Polygon" />
                <div className="gap-8 grid md:grid-cols-4">
                    <div className="">
                        <HowToUseComponent tutorials={HowToUseMarkerOverview} />

                        <Link href={route("maps.polygon.add")}>
                            <Button className="mb-4 w-full">
                                <PlusCircle />
                                Add New Polygon
                            </Button>
                        </Link>
                        <hr />
                        <Input
                            placeholder="Search..."
                            className="my-4"
                            onChange={(e) => setSearchValue(e.target.value)}
                        ></Input>
                        <div className="justify-between w-full max-h-80 overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="flex justify-between items-center">
                                            <p>Polygon</p>
                                            <p>
                                                ({filteredPolygons.length}/
                                                {polygons?.length})
                                            </p>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="block w-full">
                                    {filteredPolygons.map((polygon, index) => (
                                        <TableRow
                                            key={index}
                                            className="block w-full"
                                        >
                                            <TableCell className="flex justify-between items-center">
                                                {polygon.name}
                                                <Button
                                                    variant={"outline"}
                                                    onClick={() =>
                                                        setMapCenter({
                                                            latitude:
                                                                polygon
                                                                    .coordinates[0][0],
                                                            longitude:
                                                                polygon
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
                            zoom={13}
                            style={{ height: "500px", width: "100%" }}
                        >
                            <MapCenterUpdater
                                center={[
                                    mapCenter.latitude,
                                    mapCenter.longitude,
                                ]}
                            />
                            <TileLayer url={tileLayers[selectedLayer]} />

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
                                            {polygon.description ||
                                                "Tidak ada deskripsi"}
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
                                                            Are you absolutely
                                                            sure?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot
                                                            be undone. This will
                                                            permanently delete
                                                            polygon from our
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
                                                                    polygon.id
                                                                )
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
                    </div>
                </div>
            </DashboardMapLayout>
        </>
    );
}
