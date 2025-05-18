import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { MarkerInterface } from "@/types/types";
import { Eye } from "lucide-react";
import { memo } from "react";

interface MarkerListProps {
    filteredMarkers: MarkerInterface[];
    markerlength: number;
    loading: boolean;
    onCenterMap: (coords: [number, number]) => void;
}

export const MarkerList = memo(
    ({
        filteredMarkers,
        markerlength,
        loading,
        onCenterMap,
    }: MarkerListProps) => {
        console.log("MARKER LIST RENDER");

        return (
            <div className="">
                <div className="justify-between w-full h-80 overflow-y-auto">
                    {loading ? (
                        <div className="space-y-2">
                            {filteredMarkers.map((_, index) => (
                                <Skeleton key={index} className="w-full h-8" />
                            ))}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="flex justify-between items-center">
                                        <p>Marker</p>
                                        <p>
                                            ({filteredMarkers.length}/
                                            {markerlength})
                                        </p>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="block w-full">
                                {filteredMarkers.map((marker, index) => (
                                    <TableRow
                                        key={index}
                                        className="block w-full"
                                    >
                                        <TableCell className="flex justify-between items-center">
                                            {marker.name}
                                            <Button
                                                variant={"outline"}
                                                onClick={() =>
                                                    onCenterMap([
                                                        marker.latitude,
                                                        marker.longitude,
                                                    ])
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
            </div>
        );
    }
);
