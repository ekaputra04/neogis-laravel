import MapAddRectangleComponent from "@/Components/Maps/Rectangles/MapAddRectangleComponent";
import { CategoriesInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapAddLine() {
    const { currentPath, categories } = usePage().props;

    return (
        <>
            <div className="">
                <MapAddRectangleComponent
                    currentPath={currentPath as string}
                    categories={categories as CategoriesInterface[]}
                />
            </div>
        </>
    );
}
