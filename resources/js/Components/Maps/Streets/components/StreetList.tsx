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
import { memo } from "react";

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

        return (
            <div className="justify-between w-full max-h-80 overflow-y-auto">
                {loading ? (
                    <div className="space-y-2">
                        {filteredStreets.map((_, index) => (
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
                            {filteredStreets.map((street) => (
                                <TableRow
                                    key={street.id}
                                    className={`block w-full ${
                                        selectedStreet?.id === street.id
                                            ? "bg-green-100 hover:bg-green-100 text-black dark:text-white dark:bg-green-950"
                                            : ""
                                    }`}
                                >
                                    <TableCell className="flex justify-between items-center">
                                        {street.nama_ruas}
                                        <Button
                                            variant={"outline"}
                                            onClick={() => {
                                                handleCenterMap(
                                                    street.coordinates[0]
                                                );
                                                handleSelectedStreet(street);
                                            }}
                                        >
                                            <Eye />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        );
    }
);
