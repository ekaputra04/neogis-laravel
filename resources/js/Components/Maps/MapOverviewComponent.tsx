import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head } from "@inertiajs/react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import {
    CircleInterface,
    CoordinatesInterface,
    LineInterface,
    MarkerInterface,
    PolygonInterface,
} from "@/types/types";
import { useCallback, useState } from "react";
import { centerPoints } from "@/consts/centerPoints";
import DashboardCounterCard from "./DashboardCounterCard";
import { FilterMarker } from "./Overviews/FilterMarker";
import { FilterLine } from "./Overviews/FilterLine";
import { MapOverviewLayer } from "./Overviews/MapOverviewLayer";
import { FilterPolygon } from "./Overviews/FilterPolygon";
import { FilterCircle } from "./Overviews/FilterCircle";
import { PieChartSpatialComponent } from "../charts/PieChartSpatialComponent";
import { PieChartCategoriesComponent } from "../charts/PieChartCategoriesComponent";

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

    const handleFilterMarker = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const query = e.target.value.toLowerCase();
            const filtered = markers.filter((marker) =>
                marker.name.toLowerCase().includes(query)
            );
            setFilteredMarkers(filtered);
        },
        [markers]
    );

    const handleFilterLine = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const query = e.target.value.toLowerCase();
            const filtered = lines.filter((line) =>
                line.name.toLowerCase().includes(query)
            );
            setFilteredLines(filtered);
        },
        [lines]
    );

    const handleFilterPolygon = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const query = e.target.value.toLowerCase();
            const filtered = polygons.filter((polygon) =>
                polygon.name.toLowerCase().includes(query)
            );
            setFilteredPolygons(filtered);
        },
        [polygons]
    );

    const handleFilterCircle = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const query = e.target.value.toLowerCase();
            const filtered = circles.filter((circle) =>
                circle.name.toLowerCase().includes(query)
            );
            setFilteredCircles(filtered);
        },
        [circles]
    );

    const handleMarkerClick = useCallback(
        (marker: MarkerInterface) => {
            setMapCenter({
                latitude: marker.latitude,
                longitude: marker.longitude,
            });
        },
        [markers]
    );

    const handleLineClick = useCallback(
        (line: LineInterface) => {
            setMapCenter({
                latitude: line.coordinates[0][0],
                longitude: line.coordinates[0][1],
            });
        },
        [lines]
    );

    const handlePolygonClick = useCallback(
        (polygon: PolygonInterface) => {
            setMapCenter({
                latitude: polygon.coordinates[0][0],
                longitude: polygon.coordinates[0][1],
            });
        },
        [polygons]
    );

    const handleCircleClick = useCallback(
        (circle: CircleInterface) => {
            setMapCenter({
                latitude: circle.latitude,
                longitude: circle.longitude,
            });
        },
        [circles]
    );

    const handleSetMapCenter = (center: CoordinatesInterface) => {
        setMapCenter(center);
    };

    console.log("MAP OVERVIEW RENDER");

    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Maps" />

                <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 col-span-1 md:col-span-2 lg:col-span-4 mb-8">
                    {dashboardCounter.map((counter, index) => (
                        <DashboardCounterCard
                            key={index}
                            title={counter.title}
                            value={counter.value}
                            link={counter.link}
                        />
                    ))}
                </div>

                <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mb-4">
                    <PieChartSpatialComponent
                        markersCount={markers.length}
                        linesCount={lines.length}
                        polygonsCount={polygons.length}
                        circlesCount={circles.length}
                    />
                    <PieChartCategoriesComponent
                        markerCategoriesCount={markerCategories}
                        lineCategoriesCount={lineCategories}
                        polygonCategoriesCount={polygonCategories}
                        circleCategoriesCount={circleCategories}
                    />
                </div>

                <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    <FilterMarker
                        filteredMarkers={filteredMarkers}
                        markersLength={markers.length}
                        handleFilterMarker={handleFilterMarker}
                        handleMarkerClick={handleMarkerClick}
                    />
                    <FilterLine
                        filteredLines={filteredLines}
                        lineLength={lines.length}
                        handleFilterLine={handleFilterLine}
                        handleLineClick={handleLineClick}
                    />
                    <FilterPolygon
                        filteredPolygons={filteredPolygons}
                        polygonLength={polygons.length}
                        handleFilterPolygon={handleFilterPolygon}
                        handlePolygonClick={handlePolygonClick}
                    />
                    <FilterCircle
                        filteredCircles={filteredCircles}
                        circleLength={circles.length}
                        handleFilterCircle={handleFilterCircle}
                        handleCircleClick={handleCircleClick}
                    />
                </div>
                <MapOverviewLayer
                    mapCenter={mapCenter}
                    markers={markers}
                    lines={lines}
                    polygons={polygons}
                    circles={circles}
                    handleSetMapCenter={handleSetMapCenter}
                />
            </DashboardMapLayout>
        </>
    );
}
