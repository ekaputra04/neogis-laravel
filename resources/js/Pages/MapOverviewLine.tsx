import MapOverviewLineComponent from "@/Components/Maps/Lines/MapOverviewLineComponent";
import { LineInterface, MarkerInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapOverviewLine() {
    const { lines } = usePage().props;

    return <MapOverviewLineComponent lines={lines as LineInterface[]} />;
}
