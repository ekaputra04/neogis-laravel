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
    streets: StreetWithCoordinatesInterface[];
    filteredStreets: StreetWithCoordinatesInterface[];
    loading: boolean;
    onCenterMap: (coords: [number, number]) => void;
}

export const StreetList = memo(
    ({ streets, filteredStreets, loading, onCenterMap }: StreetListProps) => {
        console.log("StreetList rendered");

        return (
            <div className="justify-between w-full h-80 overflow-y-auto">
                {loading ? (
                    <div className="space-y-2">
                        {streets.map((_, index) => (
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
                                        ({filteredStreets.length}/
                                        {streets?.length})
                                    </p>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="block w-full">
                            {filteredStreets.map((street) => (
                                <TableRow
                                    key={street.id}
                                    className="block w-full"
                                >
                                    <TableCell className="flex justify-between items-center">
                                        {street.nama_ruas}
                                        <Button
                                            variant={"outline"}
                                            onClick={() =>
                                                onCenterMap(
                                                    street.coordinates[0]
                                                )
                                            }
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
