import MapOverviewLineComponent from "@/Components/Maps/Lines/MapOverviewLineComponent";
import { LineInterface, MarkerInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapOverviewLine() {
    const { currentPath, lines } = usePage().props;

    return (
        <>
            <div className="">
                <MapOverviewLineComponent
                    currentPath={currentPath as string}
                    lines={lines as LineInterface[]}
                />
            </div>
        </>
    );
}
