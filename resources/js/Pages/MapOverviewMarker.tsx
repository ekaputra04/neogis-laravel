import MapOverviewMarkerComponent from "@/Components/Maps/Markers/MapOverviewMarkerComponent";
import { MarkerInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapOverviewMarker() {
    const { markers } = usePage().props;

    return (
        <MapOverviewMarkerComponent markers={markers as MarkerInterface[]} />
    );
}
