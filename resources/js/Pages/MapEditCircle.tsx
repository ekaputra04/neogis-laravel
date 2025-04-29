import MapEditCircleComponent from "@/Components/Maps/Circles/MapEditCircleComponent";
import {
    CategoriesInterface,
    CircleInterface,
    MarkerInterface,
} from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapEditCircle() {
    const { currentPath, circle, categories } = usePage().props;

    return (
        <MapEditCircleComponent
            currentPath={currentPath as string}
            circle={circle as CircleInterface}
            categories={categories as CategoriesInterface[]}
        />
    );
}
