import HowToUseComponent from "@/Components/HowToUseComponent";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { HowToUseMarkerOverview } from "@/consts/howToUse";
import { capitalizeFirstLetter, handleDownload } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { Download, PlusCircle } from "lucide-react";
import { memo } from "react";

interface ElementControlsProps {
    elementType: "marker" | "line" | "polygon" | "circle";
    onSearch: (value: string) => void;
    elements: Object[];
}

export const ElementControls = memo(
    ({ onSearch, elements, elementType }: ElementControlsProps) => {
        console.log("ELEMENT CONTROLS RENDER");

        return (
            <div className="">
                <HowToUseComponent tutorials={HowToUseMarkerOverview} />
                <Link href={route(`maps.${elementType}.add`)}>
                    <Button className="mb-4 w-full">
                        <PlusCircle />
                        Add New {capitalizeFirstLetter(elementType.toString())}
                    </Button>
                </Link>
                <Button
                    className="mb-2 w-full"
                    variant={"link"}
                    onClick={() => handleDownload(elements)}
                >
                    <Download /> Download{" "}
                    {capitalizeFirstLetter(elementType.toString())} Data
                </Button>
                <hr />
                <Input
                    placeholder="Search..."
                    className="my-4"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        );
    }
);
