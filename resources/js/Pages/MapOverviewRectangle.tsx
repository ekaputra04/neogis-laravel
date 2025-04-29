import MapOverviewRectangleComponent from "@/Components/Maps/Rectangles/MapOverviewRectangleComponent";
import { RectangleInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function MapOverviewRectangle() {
    const { currentPath, rectangles } = usePage().props;

    return (
        <>
            <div className="">
                <MapOverviewRectangleComponent
                    currentPath={currentPath as string}
                    rectangles={rectangles as RectangleInterface[]}
                />
            </div>
        </>
    );
}
