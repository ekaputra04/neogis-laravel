import { Input } from "@/Components/ui/input";
import { Download, PlusCircle, Search } from "lucide-react";
import { Button } from "@/Components/ui/button";
import HowToUseComponent from "@/Components/HowToUseComponent";
import { HowToUseStreetOverview } from "@/consts/howToUse";
import {
    FilterStateInterface,
    StreetInterface,
    StreetWithCoordinatesInterface,
} from "@/types/types";
import { memo, useState } from "react";
import DialogFilterStreetComponent from "./DialogFilterStreetComponent";
import { handleDownloadExcel, handleDownloadJson } from "@/lib/utils";
import { toast } from "sonner";
import { router } from "@inertiajs/react";
import DialogDownloadStreetData from "@/Components/DialogDownloadStreetData";

interface StreetControlsProps {
    onFilterChange: (filters: FilterStateInterface) => void;
    onSearch: (value: string) => void;
    initialFilters: FilterStateInterface;
    streets: StreetWithCoordinatesInterface[];
}

export const StreetControls = memo(
    ({
        onFilterChange,
        onSearch,
        initialFilters,
        streets,
    }: StreetControlsProps) => {
        console.log("STREET CONTROL RENDER");

        const [searchValue, setSearchValue] = useState<string>("");

        return (
            <>
                <HowToUseComponent tutorials={HowToUseStreetOverview} />
                <Button
                    className="mb-2 w-full"
                    onClick={() => {
                        toast.info("Processing request...");
                        router.visit("/dashboard/street/add");
                    }}
                >
                    <PlusCircle />
                    Add New Street
                </Button>

                <DialogDownloadStreetData streets={streets} />

                <hr className="mb-2" />
                <DialogFilterStreetComponent
                    onFilterChange={onFilterChange}
                    initialFilters={initialFilters}
                />
                <div className="flex justify-between items-center gap-2">
                    <Input
                        placeholder="Search..."
                        className="my-2"
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <Button
                        className="h-9"
                        variant={"outline"}
                        onClick={() => {
                            onSearch(searchValue);
                            toast.info("Searching...");
                        }}
                    >
                        <Search />
                    </Button>
                </div>
            </>
        );
    }
);
