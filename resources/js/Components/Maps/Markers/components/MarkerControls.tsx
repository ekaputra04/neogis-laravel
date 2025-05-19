import HowToUseComponent from "@/Components/HowToUseComponent";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { HowToUseMarkerOverview } from "@/consts/howToUse";
import { handleDownload } from "@/lib/utils";
import { MarkerInterface } from "@/types/types";
import { Link } from "@inertiajs/react";
import { Download, PlusCircle } from "lucide-react";
import { memo } from "react";

interface MarkerControlsProps {
    onSearch: (value: string) => void;
    markers: MarkerInterface[];
}

export const MarkerControls = memo(
    ({ onSearch, markers }: MarkerControlsProps) => {
        console.log("MARKER CONTROLS RENDER");

        return (
            <div className="">
                <HowToUseComponent tutorials={HowToUseMarkerOverview} />
                <Link href={route("maps.marker.add")}>
                    <Button className="mb-4 w-full">
                        <PlusCircle />
                        Add New Marker
                    </Button>
                </Link>
                <Button
                    className="mb-2 w-full"
                    variant={"link"}
                    onClick={() => handleDownload(markers)}
                >
                    <Download /> Download Marker Data
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
