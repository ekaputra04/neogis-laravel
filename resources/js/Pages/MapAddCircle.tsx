import MapAddCircleComponent from "@/Components/Maps/Circles/MapAddCircleComponent";
import { CategoriesInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapAddCircle() {
    const { categories } = usePage().props;

    return (
        <MapAddCircleComponent
            categories={categories as CategoriesInterface[]}
        />
    );
}
