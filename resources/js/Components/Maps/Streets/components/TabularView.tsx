import { Button } from "@/Components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { handleDownload } from "@/lib/utils";
import {
    FilterStateInterface,
    StreetWithCoordinatesInterface,
} from "@/types/types";
import { router } from "@inertiajs/react";
import { Download, PlusCircle, Search } from "lucide-react";
import { toast } from "sonner";
import DialogFilterStreetComponent from "./DialogFilterStreetComponent";
import { Input } from "@/Components/ui/input";
import { useState } from "react";

interface TabularViewProps {
    streets: StreetWithCoordinatesInterface[];
    initialFilters: FilterStateInterface;
    onFilterChange: (filters: FilterStateInterface) => void;
    onSearch: (value: string) => void;
}

export default function TabularView({
    streets,
    initialFilters,
    onFilterChange,
    onSearch,
}: TabularViewProps) {
    const [searchValue, setSearchValue] = useState<string>("");

    return (
        <div className="">
            <div className="flex justify-between">
                <Button
                    className="mb-2 w-fit"
                    onClick={() => {
                        toast.info("Processing request...");
                        router.visit("/dashboard/street/add");
                    }}
                >
                    <PlusCircle />
                    Add New Street
                </Button>
                <Button
                    className="mb-2 w-fit"
                    variant={"link"}
                    onClick={() => handleDownload(streets)}
                >
                    <Download /> Download Street Data
                </Button>
            </div>
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
            <div className="">
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Keterangan</TableHead>
                            <TableHead>Kode</TableHead>
                            <TableHead>Panjang</TableHead>
                            <TableHead>Lebar</TableHead>
                            <TableHead>Eksisting</TableHead>
                            <TableHead>Kondisi</TableHead>
                            <TableHead>Jenis</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">
                                INV001
                            </TableCell>
                            <TableCell>Paid</TableCell>
                            <TableCell>Credit Card</TableCell>
                            <TableCell>$250.00</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
