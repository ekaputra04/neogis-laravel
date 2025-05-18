import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    EksistingJalanInterface,
    JenisJalanInterface,
    KondisiJalanInterface,
    StreetInterface,
} from "@/types/types";
import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

interface TableStreetFilterCounterProps {
    title: "Eksisting" | "Jenis" | "Kondisi";
    streets: StreetInterface[];
}

interface CountData {
    id: number;
    name: string;
    count: number;
}

export default function TableStreetFilterCounter({
    title,
    streets,
}: TableStreetFilterCounterProps) {
    const { eksisting, jenis, kondisi } = usePage().props;
    const [data, setData] = useState<CountData[]>([]);

    useEffect(() => {
        if (title === "Eksisting") {
            const eksistingList = eksisting as EksistingJalanInterface[];

            const result = eksistingList.map((item) => {
                const count = streets.filter(
                    (s) => s.eksisting_id === item.id
                ).length;
                return {
                    id: item.id,
                    name: item.eksisting,
                    count,
                };
            });

            setData(result);
        }

        if (title === "Jenis") {
            const jenisList = jenis as JenisJalanInterface[];

            const result = jenisList.map((item) => {
                const count = streets.filter(
                    (s) => s.jenisjalan_id === item.id
                ).length;
                return {
                    id: item.id,
                    name: item.jenisjalan,
                    count,
                };
            });

            setData(result);
        }

        if (title === "Kondisi") {
            const konsisiList = kondisi as KondisiJalanInterface[];

            const result = konsisiList.map((item) => {
                const count = streets.filter(
                    (s) => s.kondisi_id === item.id
                ).length;
                return {
                    id: item.id,
                    name: item.kondisi,
                    count,
                };
            });

            setData(result);
        }
    }, [title, streets]);

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
