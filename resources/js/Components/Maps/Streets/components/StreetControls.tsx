import { Input } from "@/Components/ui/input";
import { Download, PlusCircle } from "lucide-react";
import { Button } from "@/Components/ui/button";
import HowToUseComponent from "@/Components/HowToUseComponent";
import { HowToUseMarkerOverview } from "@/consts/howToUse";
import { FilterStateInterface, StreetInterface } from "@/types/types";
import { memo } from "react";
import DialogFilterStreetComponent from "./DialogFilterStreetComponent";

interface StreetControlsProps {
    onAddNew: () => void;
    onFilterChange: (filters: FilterStateInterface) => void;
    onSearch: (value: string) => void;
    initialFilters: FilterStateInterface;
    streets: StreetInterface[];
}

export const StreetControls = memo(
    ({
        onAddNew,
        onFilterChange,
        onSearch,
        initialFilters,
        streets,
    }: StreetControlsProps) => {
        console.log("STREET CONTROL RENDER");

        const handleDownload = () => {
            const jsonStr = JSON.stringify(streets, null, 2); // Pretty-print JSON
            const blob = new Blob([jsonStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = new Date().toISOString() + ".json";
            link.click();

            URL.revokeObjectURL(url);
        };

        return (
            <>
                <HowToUseComponent tutorials={HowToUseMarkerOverview} />
                <Button className="mb-2 w-full" onClick={onAddNew}>
                    <PlusCircle />
                    Add New Street
                </Button>
                <Button
                    className="mb-2 w-full"
                    variant={"link"}
                    onClick={handleDownload}
                >
                    <Download /> Download Data
                </Button>
                <hr />
                <DialogFilterStreetComponent
                    onFilterChange={onFilterChange}
                    initialFilters={initialFilters}
                />
                <Input
                    placeholder="Search..."
                    className="my-2"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </>
        );
    }
);
