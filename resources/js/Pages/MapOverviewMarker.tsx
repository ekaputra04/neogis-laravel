import MapOverviewMarkerComponent from "@/Components/Maps/Markers/MapOverviewMarkerComponent";
import { MarkerInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapOverviewMarker() {
    const { currentPath, markers } = usePage().props;

    return (
        <>
            <div className="">
                <MapOverviewMarkerComponent
                    currentPath={currentPath as string}
                    markers={markers as MarkerInterface[]}
                />
            </div>
        </>
    );
}
