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
import { capitalizeFirstLetter } from "@/lib/utils";
import {
    CircleInterface,
    CoordinatesInterface,
    LineInterface,
    MarkerInterface,
    PolygonInterface,
} from "@/types/types";
import { Eye } from "lucide-react";
import { memo } from "react";

interface ElementListProps {
    type: "marker" | "line" | "polygon" | "circle";
    filteredElements:
        | MarkerInterface[]
        | LineInterface[]
        | PolygonInterface[]
        | CircleInterface[];
    elementLength: number;
    loading: boolean;
    onCenterMap: (coords: CoordinatesInterface) => void;
}

export const ElementList = memo(
    ({
        type,
        filteredElements,
        elementLength,
        loading,
        onCenterMap,
    }: ElementListProps) => {
        console.log(type.toUpperCase() + " LIST RENDER");

        return (
            <div className="">
                <div className="justify-between w-full max-h-80 overflow-y-auto">
                    {loading ? (
                        <div className="space-y-2">
                            {filteredElements.map((_, index) => (
                                <Skeleton key={index} className="w-full h-8" />
                            ))}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="flex justify-between items-center">
                                        <p>
                                            {capitalizeFirstLetter(
                                                type.toString()
                                            )}
                                        </p>
                                        <p>
                                            ({filteredElements.length}/
                                            {elementLength})
                                        </p>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="block w-full">
                                {filteredElements.map((element, index) => (
                                    <TableRow
                                        key={index}
                                        className="block w-full"
                                    >
                                        <TableCell className="flex justify-between items-center">
                                            {element.name}
                                            <Button
                                                variant={"outline"}
                                                onClick={() => {
                                                    if (type == "marker") {
                                                        onCenterMap({
                                                            latitude: (
                                                                element as MarkerInterface
                                                            ).latitude,
                                                            longitude: (
                                                                element as MarkerInterface
                                                            ).longitude,
                                                        });
                                                    } else if (type == "line") {
                                                        onCenterMap({
                                                            latitude: (
                                                                element as LineInterface
                                                            ).coordinates[0][0],
                                                            longitude: (
                                                                element as LineInterface
                                                            ).coordinates[0][1],
                                                        });
                                                    } else if (
                                                        type == "polygon"
                                                    ) {
                                                        onCenterMap({
                                                            latitude: (
                                                                element as PolygonInterface
                                                            ).coordinates[0][0],
                                                            longitude: (
                                                                element as PolygonInterface
                                                            ).coordinates[0][1],
                                                        });
                                                    } else if (
                                                        type == "circle"
                                                    ) {
                                                        onCenterMap({
                                                            latitude: (
                                                                element as CircleInterface
                                                            ).latitude,
                                                            longitude: (
                                                                element as CircleInterface
                                                            ).longitude,
                                                        });
                                                    }
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
            </div>
        );
    }
);
