import MapAddPolygonComponent from "@/Components/Maps/Polygons/MapAddPolygonComponent";
import { CategoriesInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapAddPolygon() {
    const { currentPath, categories } = usePage().props;

    return (
        <>
            <div className="">
                <MapAddPolygonComponent
                    currentPath={currentPath as string}
                    categories={categories as CategoriesInterface[]}
                />
            </div>
        </>
    );
}
