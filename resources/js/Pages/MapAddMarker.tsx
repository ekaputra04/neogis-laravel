import MapAddMarkerComponent from "@/Components/Maps/Markers/MapAddMarkerComponent";
import { usePage } from "@inertiajs/react";

export default function MapAddMarker() {
    const { currentPath } = usePage().props;

    return (
        <>
            <div className="">
                <MapAddMarkerComponent currentPath={currentPath as string} />
            </div>
        </>
    );
}
