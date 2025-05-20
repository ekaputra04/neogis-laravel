import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { StreetInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";
import { memo, useMemo } from "react";

interface TableStreetFilterCounterProps {
    title: "Eksisting" | "Jenis" | "Kondisi";
    streets: StreetInterface[];
}

export const TableStreetFilterCounter = memo(
    ({ title, streets }: TableStreetFilterCounterProps) => {
        const { eksisting, jenis, kondisi } = usePage().props;

        console.log("TABLE STREET RENDER");

        const data = useMemo(() => {
            const sourceData =
                title === "Eksisting"
                    ? eksisting
                    : title === "Jenis"
                    ? jenis
                    : kondisi;

            return (sourceData as any[]).map((item) => {
                const filterKey =
                    title === "Eksisting"
                        ? "eksisting_id"
                        : title === "Jenis"
                        ? "jenisjalan_id"
                        : "kondisi_id";

                const count = streets.filter(
                    (s) => s[filterKey] === item.id
                ).length;

                return {
                    id: item.id,
                    name: item[title.toLowerCase()],
                    count,
                };
            });
        }, [title, streets, eksisting, jenis, kondisi]);

        return (
            <div className="shadow-md p-2 border rounded-lg max-h-32 overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{title}</TableHead>
                            <TableHead>Count</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    {item.name}
                                </TableCell>
                                <TableCell>{item.count}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }
);
