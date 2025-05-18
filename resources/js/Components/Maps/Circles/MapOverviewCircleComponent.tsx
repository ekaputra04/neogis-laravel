import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Circle,
    MapContainer,
    Polygon,
    Popup,
    TileLayer,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import {
    CircleInterface,
    CoordinatesInterface,
    PolygonInterface,
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
import { MapCenterUpdater } from "@/Components/MapCenterUpdater";

interface MapOverviewCircleComponentProps {
    currentPath: string;
    circles: CircleInterface[];
}

export default function MapOverviewCircleComponent({
    currentPath,
    circles: initialCircles,
}: MapOverviewCircleComponentProps) {
    const { selectedLayer } = useMapLayerStore();
    const [circles, setCircles] = useState<CircleInterface[]>(initialCircles);
    const [filteredCircles, setFilteredCircles] =
        useState<CircleInterface[]>(initialCircles);
    const [mapCenter, setMapCenter] = useState<CoordinatesInterface>(
        circles && circles.length > 0
            ? {
                  latitude: circles[0].latitude,
                  longitude: circles[0].longitude,
              }
            : {
                  latitude: centerPoints[0], // fallback jika circles kosong
                  longitude: centerPoints[1],
              }
    );
    const [searchValue, setSearchValue] = useState<string>("");

    const fetchCircles = async (): Promise<void> => {
        try {
            const response = await axios.get(`/api/maps/circles`);
            setCircles(response.data);
        } catch (error: any) {
            console.error(error.response?.data?.message || error.message);
        }
    };

    const handleDeleted = async (circleId: number): Promise<void> => {
        try {
            const response = await axios.delete(
                `/api/maps/circles/${circleId}`
            );
            await fetchCircles();
            toast.success("Circle deleted successfully!");
        } catch (error: any) {
            console.error(
                "Error deleting circle:",
                error.response?.data?.message || error.message
            );
            toast.error(
                error.response?.data?.message || "Error deleting circle."
            );
        }
    };

    useEffect(() => {
        if (circles) {
            const filtered = circles.filter((marker) =>
                marker.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredCircles(filtered);
        } else {
            setFilteredCircles([]);
        }
    }, [searchValue, circles]);

    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Circle" />
                <div className="gap-8 grid md:grid-cols-4">
                    <div className="">
                        <HowToUseComponent tutorials={HowToUseMarkerOverview} />

                        <Link href={route("maps.circle.add")}>
                            <Button className="mb-4 w-full">
                                <PlusCircle />
                                Add New Circle
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
                                            <p>Circle</p>
                                            <p>
                                                ({filteredCircles.length}/
                                                {circles?.length})
                                            </p>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="block w-full">
                                    {filteredCircles.map((circle, index) => (
                                        <TableRow
                                            key={index}
                                            className="block w-full"
                                        >
                                            <TableCell className="flex justify-between items-center">
                                                {circle.name}
                                                <Button
                                                    variant={"outline"}
                                                    onClick={() =>
                                                        setMapCenter({
                                                            latitude:
                                                                circle.latitude,
                                                            longitude:
                                                                circle.longitude,
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

                            {circles &&
                                circles.map((circle) => (
                                    <Circle
                                        key={circle.id}
                                        center={[
                                            circle.latitude,
                                            circle.longitude,
                                        ]}
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
                                            {circle.description ||
                                                "Tidak ada deskripsi"}
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
                                                            Are you absolutely
                                                            sure?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot
                                                            be undone. This will
                                                            permanently delete
                                                            circle from our
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
                                                                    circle.id
                                                                )
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
                        </MapContainer>
                    </div>
                </div>
            </DashboardMapLayout>
        </>
    );
}
