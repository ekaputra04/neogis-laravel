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
import { DesaInterface } from "@/types/types";
import { memo } from "react";

interface DesaTableProps {
    filteredDesa: DesaInterface[];
}

export const DesaTable = memo(({ filteredDesa }: DesaTableProps) => {
    console.log("DESA TABLE RENDER");

    return (
        <div className="p-4 border rounded-lg h-fit">
            <Table>
                <TableCaption>
                    {filteredDesa.length
                        ? `${filteredDesa.length} Desa found`
                        : `Please select Kecamatan first`}
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Desa</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredDesa.map((desa, index) => (
                        <TableRow key={desa.id}>
                            <TableCell className="font-medium">
                                {index + 1}
                            </TableCell>
                            <TableCell>{capitalizeWords(desa.desa)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
});
