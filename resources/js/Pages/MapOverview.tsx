import MapOverviewComponent from "@/Components/Maps/MapOverviewComponent";
import { MarkerInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapOverview() {
    const { currentPath, markers } = usePage().props;

    return (
        <>
            <div className="">
                <MapOverviewComponent
                    currentPath={currentPath as string}
                    markers={markers as MarkerInterface[]}
                />
            </div>
        </>
    );
}
