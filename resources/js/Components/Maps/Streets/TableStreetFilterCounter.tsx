import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { EksistingJalanInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

interface TableStreetFilterCounterProps {
    title: "Eksisting" | "Jenis" | "Kondisi";
}

export default function TableStreetFilterCounter({
    title,
}: TableStreetFilterCounterProps) {
    const { eksisting, jenis, kondisi } = usePage().props;
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (title == "Eksisting") {
            const count = (eksisting as EksistingJalanInterface[]).length;
            setCount(count);
        }
        if (title == "Kondisi") {
            const count = (eksisting as EksistingJalanInterface[]).length;
            setCount(count);
        }
    }, []);

    console.log("RENDER TABLE");

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{title}</TableHead>
                    <TableHead>Count</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>{count}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}
