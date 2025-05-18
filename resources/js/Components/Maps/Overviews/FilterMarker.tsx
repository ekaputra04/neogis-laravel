import { Input } from "@/Components/ui/input";
import { memo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { CoordinatesInterface, MarkerInterface } from "@/types/types";
import { Button } from "@/Components/ui/button";
import { Eye } from "lucide-react";

interface FilterMarkerProps {
    handleFilterMarker: (e: React.ChangeEvent<HTMLInputElement>) => void;
    filteredMarkers: MarkerInterface[];
    markersLength: number;
    handleMarkerClick: (marker: MarkerInterface) => void;
}

export const FilterMarker = memo(
    ({
        handleFilterMarker,
        filteredMarkers,
        markersLength,
        handleMarkerClick,
    }: FilterMarkerProps) => {
        console.log("FILTER MARKER RENDER");

        return (
            <div className="space-y-2">
                <Input
                    placeholder="Search marker..."
                    onChange={handleFilterMarker}
                />
                <div className="max-h-screen overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="flex justify-between items-center">
                                    <p>Marker</p>
                                    <p>
                                        ({filteredMarkers.length}/
                                        {markersLength})
                                    </p>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMarkers.map((marker, index) => (
                                <TableRow key={index}>
                                    <TableCell className="flex justify-between items-center">
                                        {marker.name}
                                        <Button
                                            variant={"outline"}
                                            onClick={() =>
                                                handleMarkerClick(marker)
                                            }
                                        >
                                            <Eye />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }
);
