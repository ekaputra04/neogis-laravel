import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head, router } from "@inertiajs/react";
import {
    Circle,
    MapContainer,
    Marker,
    Polygon,
    Polyline,
    Popup,
    TileLayer,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import {
    CircleInterface,
    CoordinatesInterface,
    LineInterface,
    MarkerInterface,
    PolygonInterface,
} from "@/types/types";
import { customIcon } from "@/Components/CustomMarkerIcon";
import { Button } from "@/Components/ui/button";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Eye } from "lucide-react";
import { centerPoints } from "@/consts/centerPoints";
import { Badge } from "../ui/badge";
import { tileLayers } from "@/consts/tileLayers";
import { useMapLayerStore } from "@/Store/useMapLayerStore";
import DashboardCounterCard from "./DashboardCounterCard";
import { Input } from "../ui/input";

interface MapOverviewComponentProps {
    currentPath: string;
    markers: MarkerInterface[];
    lines: LineInterface[];
    polygons: PolygonInterface[];
    circles: CircleInterface[];
    markerCategories: number;
    lineCategories: number;
    polygonCategories: number;
    circleCategories: number;
}

export default function MapOverviewComponent({
    currentPath,
    markers,
    lines,
    polygons,
    circles,
    markerCategories,
    lineCategories,
    polygonCategories,
    circleCategories,
}: MapOverviewComponentProps) {
    const { selectedLayer } = useMapLayerStore();
    const [mapCenter, setMapCenter] = useState<CoordinatesInterface>(
        markers && markers.length > 0
            ? {
                  latitude: markers[0].latitude,
                  longitude: markers[0].longitude,
              }
            : {
                  latitude: centerPoints[0],
                  longitude: centerPoints[1],
              }
    );
    const [filteredMarkers, setFilteredMarkers] =
        useState<MarkerInterface[]>(markers);
    const [filteredLines, setFilteredLines] = useState<LineInterface[]>(lines);
    const [filteredPolygons, setFilteredPolygons] =
        useState<PolygonInterface[]>(polygons);
    const [filteredCircles, setFilteredCircles] =
        useState<CircleInterface[]>(circles);

    const dashboardCounter = [
        {
            title: "Markers",
            value: markers.length,
            link: "/dashboard/marker",
        },
        {
            title: "Lines",
            value: lines.length,
            link: "/dashboard/line",
        },
        {
            title: "Polygons",
            value: polygons.length,
            link: "/dashboard/polygon",
        },
        {
            title: "Circles",
            value: circles.length,
            link: "/dashboard/circle",
        },
        {
            title: "Marker Categories",
            value: markerCategories,
            link: "/dashboard/marker/categories",
        },
        {
            title: "Line Categories",
            value: lineCategories,
            link: "/dashboard/line/categories",
        },
        {
            title: "Polygon Categories",
            value: polygonCategories,
            link: "/dashboard/polygon/categories",
        },
        {
            title: "Circle Categories",
            value: circleCategories,
            link: "/dashboard/circle/categories",
        },
    ];

    const handleFilterMarker = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        const filtered = markers.filter((marker) =>
            marker.name.toLowerCase().includes(query)
        );
        setFilteredMarkers(filtered);
    };

    const handleFilterLine = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        const filtered = lines.filter((line) =>
            line.name.toLowerCase().includes(query)
        );
        setFilteredLines(filtered);
    };

    const handleFilterPolygon = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        const filtered = polygons.filter((polygon) =>
            polygon.name.toLowerCase().includes(query)
        );
        setFilteredPolygons(filtered);
    };

    const handleFilterCircle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        const filtered = circles.filter((circle) =>
            circle.name.toLowerCase().includes(query)
        );
        setFilteredCircles(filtered);
    };

    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Maps" />
                <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    {dashboardCounter.map((counter, index) => (
                        <DashboardCounterCard
                            key={index}
                            title={counter.title}
                            value={counter.value}
                            link={counter.link}
                        />
                    ))}
                </div>

                <div className="z-0 mb-8">
                    <MapContainer
                        center={[mapCenter.latitude, mapCenter.longitude]}
                        zoom={16}
                        style={{ height: "500px", width: "100%" }}
                    >
                        <MapCenterUpdater
                            center={[mapCenter.latitude, mapCenter.longitude]}
                        />
                        <TileLayer url={tileLayers[selectedLayer]} />

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
                                        {marker.category_name && (
                                            <>
                                                <Badge variant={"default"}>
                                                    {marker.category_name}
                                                </Badge>
                                            </>
                                        )}
                                    </Popup>
                                </Marker>
                            ))}

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
                                    </Popup>
                                </Polyline>
                            ))}

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
                                    </Popup>
                                </Polygon>
                            ))}

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
                                    </Popup>
                                </Circle>
                            ))}
                    </MapContainer>
                </div>

                <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="Search marker..."
                            onChange={handleFilterMarker}
                        />
                        <div className="max-h-screen overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="flex justify-between items-center">
                                            <p>Marker</p>
                                            <p>
                                                ({filteredMarkers.length}/
                                                {markers.length})
                                            </p>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMarkers.map((marker, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="flex justify-between items-center">
                                                {marker.name}
                                                <Button
                                                    variant={"outline"}
                                                    onClick={() =>
                                                        setMapCenter({
                                                            latitude:
                                                                marker.latitude,
                                                            longitude:
                                                                marker.longitude,
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
                    <div className="space-y-2">
                        <Input
                            placeholder="Search line..."
                            onChange={handleFilterLine}
                        />
                        <div className="max-h-screen overflow-y-auto">
                            <Table className="">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="flex justify-between items-center">
                                            <p>Line</p>
                                            <p>
                                                ({filteredLines.length}/
                                                {lines.length})
                                            </p>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLines.map((line, index) => (
                                        <TableRow key={index}>
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
                    <div className="space-y-2">
                        <Input
                            placeholder="Search polygon..."
                            onChange={handleFilterPolygon}
                        />
                        <div className="max-h-screen overflow-y-auto">
                            <Table className="">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="flex justify-between items-center">
                                            <p>Polygon</p>
                                            <p>
                                                ({filteredPolygons.length}/
                                                {polygons.length})
                                            </p>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPolygons.map((polygon, index) => (
                                        <TableRow key={index}>
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
                    <div className="space-y-2">
                        <Input
                            placeholder="Search circle..."
                            onChange={handleFilterCircle}
                        />
                        <div className="max-h-screen overflow-y-auto">
                            <Table className="">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="flex justify-between items-center">
                                            <p>Circle</p>
                                            <p>
                                                ({filteredCircles.length}/
                                                {circles.length})
                                            </p>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCircles.map((circle, index) => (
                                        <TableRow key={index}>
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
                </div>
            </DashboardMapLayout>
        </>
    );
}

const MapCenterUpdater = ({ center }: { center: [number, number] }) => {
    const map = useMap();

    useEffect(() => {
        map.flyTo(center, map.getZoom());
    }, [center, map]);

    return null;
};
