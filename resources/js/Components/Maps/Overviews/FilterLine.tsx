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
import { LineInterface } from "@/types/types";

interface FilterLineProps {
    handleFilterLine: (e: React.ChangeEvent<HTMLInputElement>) => void;
    filteredLines: LineInterface[];
    lineLength: number;
    handleLineClick: (line: LineInterface) => void;
}

export const FilterLine = memo(
    ({
        handleFilterLine,
        filteredLines,
        lineLength,
        handleLineClick,
    }: FilterLineProps) => {
        console.log("FILTER LINE RENDER");

        return (
            <div className="space-y-2">
                <Input
                    placeholder="Search line..."
                    onChange={handleFilterLine}
                />
                <div className="max-h-screen overflow-y-auto">
                    <Table className="">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="flex justify-between items-center">
                                    <p>Line</p>
                                    <p>
                                        ({filteredLines.length}/{lineLength})
                                    </p>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLines.map((line, index) => (
                                <TableRow key={index}>
                                    <TableCell className="flex justify-between items-center">
                                        {line.name}
                                        <Button
                                            variant={"outline"}
                                            onClick={() =>
                                                handleLineClick(line)
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
