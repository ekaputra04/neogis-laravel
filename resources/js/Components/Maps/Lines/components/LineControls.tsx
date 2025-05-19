import HowToUseComponent from "@/Components/HowToUseComponent";
import SearchAddress from "@/Components/SearchAddress";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { HowToUseMarkerOverview } from "@/consts/howToUse";
import { LineInterface } from "@/types/types";
import { Link } from "@inertiajs/react";
import { PlusCircle } from "lucide-react";
import { memo } from "react";

interface LineControlsProps {
    onSearch: (value: string) => void;
    lines: LineInterface[];
}

export const LineControls = memo(({ lines, onSearch }: LineControlsProps) => {
    return (
        <div className="">
            <HowToUseComponent tutorials={HowToUseMarkerOverview} />
            <Link href={route("maps.line.add")}>
                <Button className="mb-4 w-full">
                    <PlusCircle />
                    Add New Line
                </Button>
            </Link>
            <hr />
            <Input
                placeholder="Search..."
                className="my-4"
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    );
});
