import MapAddCircleComponent from "@/Components/Maps/Circles/MapAddCircleComponent";
import { CategoriesInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapAddCircle() {
    const { currentPath, categories } = usePage().props;

    return (
        <MapAddCircleComponent
            currentPath={currentPath as string}
            categories={categories as CategoriesInterface[]}
        />
    );
}
