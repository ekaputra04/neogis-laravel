import MapEditPolygonComponent from "@/Components/Maps/Polygons/MapEditPolygonComponent";
import { CategoriesInterface, PolygonInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapEditPolygon() {
    const { currentPath, polygon, categories } = usePage().props;

    return (
        <>
            <div className="">
                <MapEditPolygonComponent
                    currentPath={currentPath as string}
                    polygon={polygon as PolygonInterface}
                    categories={categories as CategoriesInterface[]}
                />
            </div>
        </>
    );
}
