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
import { capitalizeWords } from "@/lib/utils";
import { KabupatenInterface } from "@/types/types";
import { Eye } from "lucide-react";
import { memo } from "react";

interface KabupatenTableProps {
    filteredKabupaten: KabupatenInterface[];
    selectedKabupaten: number | undefined;
    onSelectKabupaten: (kabupatenId: number) => void;
}

export const KabupatenTable = memo(
    ({
        filteredKabupaten,
        selectedKabupaten,
        onSelectKabupaten,
    }: KabupatenTableProps) => {
        console.log("KABUPATEN TABLE RENDER");

        return (
            <div className="p-4 border rounded-lg h-fit">
                <Table>
                    <TableCaption>
                        {filteredKabupaten.length
                            ? `${filteredKabupaten.length} Kabupaten found`
                            : `Kabupaten not found`}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Kabupaten</TableHead>
                            <TableHead>Detail</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredKabupaten.map((kabupaten, index) => (
                            <TableRow
                                key={kabupaten.id}
                                className={`${
                                    kabupaten.id == selectedKabupaten
                                        ? "bg-muted/50"
                                        : ""
                                }`}
                            >
                                <TableCell className="font-medium">
                                    {index + 1}
                                </TableCell>
                                <TableCell>
                                    {capitalizeWords(kabupaten.kabupaten)}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant={"outline"}
                                        onClick={() =>
                                            onSelectKabupaten(kabupaten.id)
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
        );
    }
);
