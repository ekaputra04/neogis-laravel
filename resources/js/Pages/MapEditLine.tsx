import MapEditLineComponent from "@/Components/Maps/Lines/MapEditLineComponent";
import { CategoriesInterface, LineInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapEditLine() {
    const { currentPath, line, categories } = usePage().props;

    return (
        <>
            <div className="">
                <MapEditLineComponent
                    currentPath={currentPath as string}
                    line={line as LineInterface}
                    categories={categories as CategoriesInterface[]}
                />
            </div>
        </>
    );
}
