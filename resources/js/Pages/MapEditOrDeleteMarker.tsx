import MapEditOrDeleteMarkerComponent from "@/Components/Maps/Markers/MapEditOrDeleteMarkerComponent";
import { usePage } from "@inertiajs/react";

export default function MapEditOrDeleteMarker() {
    const { currentPath } = usePage().props;

    return (
        <>
            <div className="">
                <MapEditOrDeleteMarkerComponent
                    currentPath={currentPath as string}
                />
            </div>
        </>
    );
}
