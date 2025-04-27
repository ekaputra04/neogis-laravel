import MapAddLineComponent from "@/Components/Maps/Lines/MapAddLineComponent";
import { CategoriesInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapAddLine() {
    const { currentPath, categories } = usePage().props;

    return (
        <>
            <div className="">
                <MapAddLineComponent
                    currentPath={currentPath as string}
                    categories={categories as CategoriesInterface[]}
                />
            </div>
        </>
    );
}
