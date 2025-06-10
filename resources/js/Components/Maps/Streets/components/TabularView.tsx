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
import { getContrastTextColor, handleDownload, roundToTwo } from "@/lib/utils";
import {
    FilterStateInterface,
    StreetWithCoordinatesInterface,
} from "@/types/types";
import { router } from "@inertiajs/react";
import { Download, Pencil, PlusCircle, Search, Trash } from "lucide-react";
import { toast } from "sonner";
import DialogFilterStreetComponent from "./DialogFilterStreetComponent";
import { Input } from "@/Components/ui/input";
import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/Components/ui/badge";
import { useStreetLegendStore } from "@/Store/useStreetLegendStore";
import { filterData } from "@/consts/filtersData";
import { Skeleton } from "@/Components/ui/skeleton";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface TabularViewProps {
    streets: StreetWithCoordinatesInterface[];
    loading: boolean;
    handleDeleted: (id: number) => void;
}

export default function TabularView({
    streets,
    loading,
    handleDeleted,
}: TabularViewProps) {
    const { eksisting, jenis, kondisi } = useStreetLegendStore();

    const [filters, setFilters] = useState<FilterStateInterface>(filterData);
    const [searchInput, setSearchInput] = useState<string>("");
    const [searchValue, setSearchValue] = useState<string>("");
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [currentPage, setCurrentPage] = useState(1);

    const filteredStreets = useMemo(() => {
        if (!streets) return [];
        const { eksisting, jenis, kondisi } = filters;
        const searchLower = searchValue.toLowerCase();

        const allFiltersFalse =
            !Object.values(eksisting).some(Boolean) &&
            !Object.values(jenis).some(Boolean) &&
            !Object.values(kondisi).some(Boolean);

        if (allFiltersFalse) return [];

        return streets.filter((street) => {
            const eksistingMatch =
                !Object.values(eksisting).some(Boolean) ||
                eksisting[street.eksisting_id];
            const jenisMatch =
                !Object.values(jenis).some(Boolean) ||
                jenis[street.jenisjalan_id];
            const kondisiMatch =
                !Object.values(kondisi).some(Boolean) ||
                kondisi[street.kondisi_id];
            const nameMatch = street.nama_ruas
                .toLowerCase()
                .includes(searchLower);

            return eksistingMatch && jenisMatch && kondisiMatch && nameMatch;
        });
    }, [streets, filters, searchValue]);

    const handleFilterChange = useCallback(
        (newFilters: FilterStateInterface) => {
            setFilters(newFilters);
        },
        []
    );

    const totalPages = Math.ceil(filteredStreets.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentStreets = filteredStreets.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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

            <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex justify-between items-center gap-2">
                    <Input
                        placeholder="Search..."
                        className="my-2 w-full h-8"
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <Button
                        className="my-2 h-8"
                        onClick={() => setSearchValue(searchInput)}
                    >
                        <Search />
                    </Button>
                </div>
                <div className="flex justify-between items-center gap-2">
                    <div className="">
                        <Select
                            onValueChange={(e) => setItemsPerPage(parseInt(e))}
                            defaultValue={itemsPerPage.toString()}
                        >
                            <SelectTrigger className="w-32 h-8">
                                <SelectValue placeholder="Row Count" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFilterStreetComponent
                        onFilterChange={handleFilterChange}
                        initialFilters={filters}
                    />
                    <Button variant={"outline"} className="block text-sm">
                        ({filteredStreets.length} / {streets.length})
                    </Button>
                </div>
            </div>
            <hr className="my-2" />
            <div className="w-full">
                {loading ? (
                    <div className="space-y-2">
                        {Array.from({
                            length: Math.min(
                                itemsPerPage,
                                filteredStreets.length
                            ),
                        }).map((_, index) => (
                            <Skeleton key={index} className="w-full h-8" />
                        ))}
                    </div>
                ) : (
                    <Table>
                        <TableCaption>A list of streets</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Keterangan</TableHead>
                                <TableHead>Kode</TableHead>
                                <TableHead>Panjang (m)</TableHead>
                                <TableHead>Lebar (m)</TableHead>
                                <TableHead>Eksisting</TableHead>
                                <TableHead>Kondisi</TableHead>
                                <TableHead>Jenis</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentStreets.length > 0 ? (
                                currentStreets.map((street, index) => {
                                    // Cari data eksisting, kondisi, dan jenis berdasarkan ID
                                    const eksistingItem = eksisting.find(
                                        (eks) => eks.id === street.eksisting_id
                                    );
                                    const kondisiItem = kondisi.find(
                                        (kond) => kond.id === street.kondisi_id
                                    );
                                    const jenisItem = jenis.find(
                                        (jns) => jns.id === street.jenisjalan_id
                                    );

                                    return (
                                        <TableRow key={street.id}>
                                            <TableCell className="font-medium">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>
                                                {street.nama_ruas ||
                                                    "Jalan Tanpa Nama"}
                                            </TableCell>
                                            <TableCell>
                                                {street.keterangan || "-"}
                                            </TableCell>
                                            <TableCell>
                                                {street.kode_ruas || "-"}
                                            </TableCell>
                                            <TableCell>
                                                {roundToTwo(street.panjang) ||
                                                    "-"}
                                            </TableCell>
                                            <TableCell>
                                                {roundToTwo(street.lebar) ||
                                                    "-"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    style={{
                                                        backgroundColor:
                                                            eksistingItem?.color ||
                                                            "#ffa96b",
                                                        color: eksistingItem
                                                            ? getContrastTextColor(
                                                                  eksistingItem.color
                                                              )
                                                            : "#000000",
                                                    }}
                                                >
                                                    {eksistingItem?.eksisting ||
                                                        "Tidak Diketahui"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    style={{
                                                        backgroundColor:
                                                            kondisiItem?.color ||
                                                            "#e0e0e0",
                                                        color: kondisiItem
                                                            ? getContrastTextColor(
                                                                  kondisiItem.color
                                                              )
                                                            : "#000000",
                                                    }}
                                                >
                                                    {kondisiItem?.kondisi ||
                                                        "Tidak Diketahui"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    style={{
                                                        backgroundColor:
                                                            jenisItem?.color ||
                                                            "#e0e0e0",
                                                        color: jenisItem
                                                            ? getContrastTextColor(
                                                                  jenisItem.color
                                                              )
                                                            : "#000000",
                                                    }}
                                                >
                                                    {jenisItem?.jenisjalan ||
                                                        "Tidak Diketahui"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    className="mr-2"
                                                    onClick={() => {
                                                        toast.info(
                                                            "Processing request..."
                                                        );
                                                        router.visit(
                                                            `/dashboard/street/edit/${street.id}`
                                                        );
                                                    }}
                                                    variant={"outline"}
                                                >
                                                    <Pencil />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger className="inline-flex justify-center items-center gap-2 bg-destructive hover:bg-destructive/90 disabled:opacity-50 shadow-sm px-3 py-1 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&_svg]:size-4 font-medium text-destructive-foreground text-sm whitespace-nowrap transition-colors [&_svg]:pointer-events-none disabled:pointer-events-none [&_svg]:shrink-0">
                                                        <Trash />
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Are you
                                                                absolutely sure?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action
                                                                cannot be
                                                                undone. This
                                                                will permanently
                                                                delete{" "}
                                                                <span className="font-semibold">
                                                                    {
                                                                        street.nama_ruas
                                                                    }
                                                                </span>{" "}
                                                                from our
                                                                servers.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    handleDeleted(
                                                                        street.id
                                                                    )
                                                                }
                                                            >
                                                                Continue
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={9}
                                        className="text-center"
                                    >
                                        Data not found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
                <Pagination className="mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                className={
                                    currentPage === 1
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                            />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    href="#"
                                    isActive={currentPage === index + 1}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                className={
                                    currentPage === totalPages
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
