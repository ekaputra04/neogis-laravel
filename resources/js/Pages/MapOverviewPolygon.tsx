import MapOverviewPolygonComponent from "@/Components/Maps/Polygons/MapOverviewPolygonComponent";
import { PolygonInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapOverviewPolygon() {
    const { currentPath, polygons } = usePage().props;

    return (
        <>
            <div className="">
                <MapOverviewPolygonComponent
                    currentPath={currentPath as string}
                    polygons={polygons as PolygonInterface[]}
                />
            </div>
        </>
    );
}
