import { Input } from "@/Components/ui/input";
import { PlusCircle } from "lucide-react";
import { Button } from "@/Components/ui/button";
import HowToUseComponent from "@/Components/HowToUseComponent";
import { HowToUseMarkerOverview } from "@/consts/howToUse";
import { FilterStateInterface } from "@/types/types";
import { memo } from "react";
import DialogFilterStreetComponent from "./DialogFilterStreetComponent";

interface StreetControlsProps {
    onAddNew: () => void;
    onFilterChange: (filters: FilterStateInterface) => void;
    onSearch: (value: string) => void;
    initialFilters: FilterStateInterface;
}

export const StreetControls = memo(
    ({
        onAddNew,
        onFilterChange,
        onSearch,
        initialFilters,
    }: StreetControlsProps) => {
        console.log("STREET CONTROL RENDER");

        return (
            <>
                <HowToUseComponent tutorials={HowToUseMarkerOverview} />
                <Button className="mb-4 w-full" onClick={onAddNew}>
                    <PlusCircle />
                    Add New Street
                </Button>
                <hr />
                <DialogFilterStreetComponent
                    onFilterChange={onFilterChange}
                    initialFilters={initialFilters}
                />
                <Input
                    placeholder="Search..."
                    className="my-4"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </>
        );
    }
);
