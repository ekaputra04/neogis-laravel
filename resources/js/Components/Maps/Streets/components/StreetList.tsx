import { Skeleton } from "@/Components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Eye } from "lucide-react";
import { StreetWithCoordinatesInterface } from "@/types/types";
import { memo, useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";

interface StreetListProps {
    streetLength: number;
    filteredStreets: StreetWithCoordinatesInterface[];
    loading: boolean;
    selectedStreet?: StreetWithCoordinatesInterface | null;
    handleCenterMap: (coords: [number, number]) => void;
    handleSelectedStreet: (street: StreetWithCoordinatesInterface) => void;
}

export const StreetList = memo(
    ({
        streetLength,
        filteredStreets,
        loading,
        selectedStreet,
        handleCenterMap,
        handleSelectedStreet,
    }: StreetListProps) => {
        console.log("STREET LIST RENDER");

        const [currentPage, setCurrentPage] = useState(1);
        const itemsPerPage = 10;

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
                        <TableHeader>
                            <TableRow>
                                <TableHead className="flex justify-between items-center">
                                    <p>Street</p>
                                    <p>
                                        ({filteredStreets.length}/{streetLength}
                                        )
                                    </p>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="block w-full">
                            {currentStreets.length > 0 ? (
                                currentStreets.map((street) => (
                                    <TableRow
                                        key={street.id}
                                        className={`block w-full ${
                                            selectedStreet?.id === street.id
                                                ? "bg-green-100 hover:bg-green-100 text-black dark:text-white dark:bg-green-950"
                                                : ""
                                        }`}
                                    >
                                        <TableCell className="flex justify-between items-center">
                                            {street.nama_ruas ||
                                                "Jalan Tanpa Nama"}
                                            <Button
                                                variant={"outline"}
                                                onClick={() => {
                                                    handleCenterMap(
                                                        street.coordinates[0]
                                                    );
                                                    handleSelectedStreet(
                                                        street
                                                    );
                                                }}
                                            >
                                                <Eye />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className="block w-full">
                                    <TableCell className="text-center">
                                        Tidak ada data
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
        );
    }
);
