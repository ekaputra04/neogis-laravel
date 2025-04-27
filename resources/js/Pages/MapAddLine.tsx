import MapAddMarkerComponent from "@/Components/Maps/Markers/MapAddMarkerComponent";
import { CategoriesInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapAddLine() {
    const { currentPath, categories } = usePage().props;

    return (
        <>
            <div className="">
                <MapAddMarkerComponent
                    currentPath={currentPath as string}
                    categories={categories as CategoriesInterface[]}
                />
            </div>
        </>
    );
}
