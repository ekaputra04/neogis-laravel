import MapOverviewCircleComponent from "@/Components/Maps/Circles/MapOverviewCircleComponent";
import { CircleInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapOverviewCircle() {
    const { currentPath, circles } = usePage().props;

    return (
        <MapOverviewCircleComponent
            currentPath={currentPath as string}
            circles={circles as CircleInterface[]}
        />
    );
}
