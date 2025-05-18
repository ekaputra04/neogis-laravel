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
import { CoordinatesInterface, LineInterface } from "@/types/types";
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

interface MapOverviewLineComponentProps {
    currentPath: string;
    lines: LineInterface[];
}

export default function MapOverviewLineComponent({
    currentPath,
    lines: initialLines,
}: MapOverviewLineComponentProps) {
    const { selectedLayer } = useMapLayerStore();
    const [lines, setLines] = useState<LineInterface[] | null>(initialLines);
    const [filteredLines, setFilteredLines] =
        useState<LineInterface[]>(initialLines);
    const [mapCenter, setMapCenter] = useState<CoordinatesInterface>(
        lines && lines.length > 0
            ? {
                  latitude: lines[0].coordinates[0][0],
                  longitude: lines[0].coordinates[0][1],
              }
            : {
                  latitude: centerPoints[0], // fallback jika lines kosong
                  longitude: centerPoints[1],
              }
    );
    const [searchValue, setSearchValue] = useState<string>("");

    const fetchlines = async (): Promise<void> => {
        try {
            const response = await axios.get(`/api/maps/lines`);
            setLines(response.data);
        } catch (error: any) {
            console.error(error.response?.data?.message || error.message);
        }
    };

    const handleDeleted = async (lineId: number): Promise<void> => {
        try {
            const response = await axios.delete(`/api/maps/lines/${lineId}`);
            await fetchlines();
            toast.success("Line deleted successfully!");
        } catch (error: any) {
            console.error(
                "Error deleting line:",
                error.response?.data?.message || error.message
            );
            toast.error(
                error.response?.data?.message || "Error deleting line."
            );
        }
    };

    useEffect(() => {
        if (lines) {
            const filtered = lines.filter((marker) =>
                marker.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredLines(filtered);
        } else {
            setFilteredLines([]);
        }
    }, [searchValue, lines]);

    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Line" />
                <div className="gap-8 grid md:grid-cols-4">
                    <div className="">
                        <HowToUseComponent tutorials={HowToUseMarkerOverview} />

                        <Link href={route("maps.line.add")}>
                            <Button className="mb-4 w-full">
                                <PlusCircle />
                                Add New Line
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
                                            <p>Line</p>
                                            <p>
                                                ({filteredLines.length}/
                                                {lines?.length})
                                            </p>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="block w-full">
                                    {filteredLines.map((line, index) => (
                                        <TableRow
                                            key={index}
                                            className="block w-full"
                                        >
                                            <TableCell className="flex justify-between items-center">
                                                {line.name}
                                                <Button
                                                    variant={"outline"}
                                                    onClick={() =>
                                                        setMapCenter({
                                                            latitude:
                                                                line
                                                                    .coordinates[0][0],
                                                            longitude:
                                                                line
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

                            {lines &&
                                lines.map((line) => (
                                    <Polyline
                                        key={line.id}
                                        positions={line.coordinates}
                                        color={line.color || "blue"}
                                    >
                                        <Popup>
                                            {line.name ? (
                                                <strong>{line.name}</strong>
                                            ) : (
                                                "Lokasi tanpa nama"
                                            )}
                                            <br />
                                            <br />
                                            {line.description ||
                                                "Tidak ada deskripsi"}
                                            <br />
                                            <br />
                                            {line.category_name && (
                                                <>
                                                    <Badge variant={"default"}>
                                                        {line.category_name}
                                                    </Badge>
                                                </>
                                            )}
                                            <br />
                                            <br />
                                            <Button
                                                className="mr-2"
                                                onClick={() => {
                                                    router.visit(
                                                        `/dashboard/line/edit/${line.id}`
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
                                                            line from our
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
                                                                    line.id
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
