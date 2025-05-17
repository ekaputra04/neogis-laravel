import MapOverviewComponent from "@/Components/Maps/MapOverviewComponent";
import {
    CircleInterface,
    LineInterface,
    MarkerInterface,
    PolygonInterface,
} from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapOverview() {
    const {
        currentPath,
        markers,
        lines,
        polygons,
        circles,
        markerCategories,
        lineCategories,
        polygonCategories,
        circleCategories,
    } = usePage().props;

    return (
        <>
            <MapOverviewComponent
                currentPath={currentPath as string}
                markers={markers as MarkerInterface[]}
                lines={lines as LineInterface[]}
                polygons={polygons as PolygonInterface[]}
                circles={circles as CircleInterface[]}
                markerCategories={markerCategories as number}
                lineCategories={lineCategories as number}
                polygonCategories={polygonCategories as number}
                circleCategories={circleCategories as number}
            />
        </>
    );
}
