import MapEditMarkerComponent from "@/Components/Maps/Markers/MapEditMarkerComponent";
import { MarkerInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapAddMarker() {
    const { currentPath, marker } = usePage().props;

    return (
        <>
            <div className="">
                <MapEditMarkerComponent
                    currentPath={currentPath as string}
                    marker={marker as MarkerInterface}
                />
            </div>
        </>
    );
}
