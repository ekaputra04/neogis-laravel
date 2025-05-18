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
import { Button } from "@/Components/ui/button";
import { Eye } from "lucide-react";
import { PolygonInterface } from "@/types/types";

interface FilterPolygonProps {
    handleFilterPolygon: (e: React.ChangeEvent<HTMLInputElement>) => void;
    filteredPolygons: PolygonInterface[];
    polygonLength: number;
    handlePolygonClick: (polygon: PolygonInterface) => void;
}

export const FilterPolygon = memo(
    ({
        handleFilterPolygon,
        filteredPolygons,
        polygonLength,
        handlePolygonClick,
    }: FilterPolygonProps) => {
        console.log("FILTER POLYGON RENDER");

        return (
            <div className="space-y-2">
                <Input
                    placeholder="Search polygon..."
                    onChange={handleFilterPolygon}
                />
                <div className="max-h-screen overflow-y-auto">
                    <Table className="">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="flex justify-between items-center">
                                    <p>Polygon</p>
                                    <p>
                                        ({filteredPolygons.length}/
                                        {polygonLength})
                                    </p>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPolygons.map((polygon, index) => (
                                <TableRow key={index}>
                                    <TableCell className="flex justify-between items-center">
                                        {polygon.name}
                                        <Button
                                            variant={"outline"}
                                            onClick={() =>
                                                handlePolygonClick(polygon)
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
