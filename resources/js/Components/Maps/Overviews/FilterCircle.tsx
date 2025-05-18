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
import { CircleInterface } from "@/types/types";

interface FilterCircleProps {
    handleFilterCircle: (e: React.ChangeEvent<HTMLInputElement>) => void;
    filteredCircles: CircleInterface[];
    circleLength: number;
    handleCircleClick: (circle: CircleInterface) => void;
}

export const FilterCircle = memo(
    ({
        handleFilterCircle,
        filteredCircles,
        circleLength,
        handleCircleClick,
    }: FilterCircleProps) => {
        console.log("FILTER CIRCLE RENDER");

        return (
            <div className="space-y-2">
                <Input
                    placeholder="Search circle..."
                    onChange={handleFilterCircle}
                />
                <div className="max-h-screen overflow-y-auto">
                    <Table className="">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="flex justify-between items-center">
                                    <p>Circle</p>
                                    <p>
                                        ({filteredCircles.length}/{circleLength}
                                        )
                                    </p>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCircles.map((circle, index) => (
                                <TableRow key={index}>
                                    <TableCell className="flex justify-between items-center">
                                        {circle.name}
                                        <Button
                                            variant={"outline"}
                                            onClick={() =>
                                                handleCircleClick(circle)
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
