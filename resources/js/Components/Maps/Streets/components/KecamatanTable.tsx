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
import { KecamatanInterface } from "@/types/types";
import { Eye } from "lucide-react";
import { memo } from "react";

interface KecamatanTableProps {
    filteredKecamatan: KecamatanInterface[];
    selectedKecamatan: number | undefined;
    onSelectKecamatan: (kecamatanId: number) => void;
}

export const KecamatanTable = memo(
    ({
        filteredKecamatan,
        selectedKecamatan,
        onSelectKecamatan,
    }: KecamatanTableProps) => {
        console.log("KECAMATAN TABLE RENDER");

        return (
            <div className="p-4 border rounded-lg h-fit">
                <Table>
                    <TableCaption>
                        {filteredKecamatan.length
                            ? `${filteredKecamatan.length} Kecamatan found`
                            : `Please select Kabupaten first`}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Kecamatan</TableHead>
                            <TableHead>Detail</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredKecamatan.map((kecamatan, index) => (
                            <TableRow
                                key={kecamatan.id}
                                className={`${
                                    kecamatan.id == selectedKecamatan
                                        ? "bg-muted/50"
                                        : ""
                                }`}
                            >
                                <TableCell className="font-medium">
                                    {index + 1}
                                </TableCell>
                                <TableCell>
                                    {capitalizeWords(kecamatan.kecamatan)}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant={"outline"}
                                        onClick={() =>
                                            onSelectKecamatan(kecamatan.id)
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
