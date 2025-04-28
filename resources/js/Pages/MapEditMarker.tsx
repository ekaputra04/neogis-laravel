import MapEditMarkerComponent from "@/Components/Maps/Markers/MapEditMarkerComponent";
import { CategoriesInterface, MarkerInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapEditMarker() {
    const { currentPath, marker, categories } = usePage().props;

    return (
        <>
            <div className="">
                <MapEditMarkerComponent
                    currentPath={currentPath as string}
                    marker={marker as MarkerInterface}
                    categories={categories as CategoriesInterface[]}
                />
            </div>
        </>
    );
}
