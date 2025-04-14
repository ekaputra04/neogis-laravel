import MapOverviewMarkerComponent from "@/Components/Maps/Markers/MapOverviewMarkerComponent";
import { usePage } from "@inertiajs/react";

export default function MapOverviewMarker() {
    const { currentPath } = usePage().props;

    return (
        <>
            <div className="">
                <MapOverviewMarkerComponent
                    currentPath={currentPath as string}
                />
            </div>
        </>
    );
}
