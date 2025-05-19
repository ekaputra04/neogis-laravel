import MapOverviewPolygonComponent from "@/Components/Maps/Polygons/MapOverviewPolygonComponent";
import { PolygonInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapOverviewPolygon() {
    const { polygons } = usePage().props;

    return (
        <MapOverviewPolygonComponent
            polygons={polygons as PolygonInterface[]}
        />
    );
}
