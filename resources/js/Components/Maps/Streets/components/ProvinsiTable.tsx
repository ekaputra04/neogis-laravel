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
import { ProvinsiInterface } from "@/types/types";
import { Eye } from "lucide-react";
import { memo } from "react";

interface ProvinsiTableProps {
    filteredProvinsi: ProvinsiInterface[];
    selectedProvinsi: number | undefined;
    onSelectProvinsi: (provinsiId: number) => void;
}

export const ProvinsiTable = memo(
    ({
        filteredProvinsi,
        selectedProvinsi,
        onSelectProvinsi,
    }: ProvinsiTableProps) => {
        console.log("PROVINSI TABLE RENDER");

        return (
            <div className="p-4 border rounded-lg h-fit">
                <Table>
                    <TableCaption>
                        {filteredProvinsi.length
                            ? `${filteredProvinsi.length} Provinsi found`
                            : `Provinsi not found`}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Provinsi</TableHead>
                            <TableHead>Detail</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProvinsi.map((provinsi, index) => (
                            <TableRow
                                key={provinsi.id}
                                className={`${
                                    provinsi.id == selectedProvinsi
                                        ? "bg-muted/50"
                                        : ""
                                }`}
                            >
                                <TableCell className="font-medium">
                                    {index + 1}
                                </TableCell>
                                <TableCell>
                                    {capitalizeWords(provinsi.provinsi)}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant={"outline"}
                                        onClick={() =>
                                            onSelectProvinsi(provinsi.id)
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
