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
import { memo, useEffect, useMemo, useState } from "react";

interface TableStreetFilterCounterProps {
    title: "Eksisting" | "Jenis" | "Kondisi";
    streets: StreetInterface[];
}

const TOKEN = localStorage.getItem("external_api_token") as string;
const API_URL = import.meta.env.VITE_API_URL;

export const TableStreetFilterCounter = memo(
    ({ title, streets }: TableStreetFilterCounterProps) => {
        // const { eksisting, jenis, kondisi } = usePage().props;

        const [eksisting, setEksisting] = useState<EksistingJalanInterface[]>(
            []
        );
        const [jenis, setJenis] = useState<JenisJalanInterface[]>([]);
        const [kondisi, setKondisi] = useState<KondisiJalanInterface[]>([]);

        useEffect(() => {
            const fetchDataEksisting = async () => {
                try {
                    const response = await fetch(`${API_URL}/meksisting`, {
                        headers: { Authorization: `Bearer ${TOKEN}` },
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch eksisting data");
                    }

                    const data = await response.json();
                    setEksisting(data.eksisting);
                } catch (error) {
                    console.error("Error fetching eksisting data:", error);
                }
            };

            const fetchDataJenis = async () => {
                try {
                    const response = await fetch(`${API_URL}/mjenisjalan`, {
                        headers: { Authorization: `Bearer ${TOKEN}` },
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch jenis data");
                    }

                    const data = await response.json();
                    setJenis(data.eksisting);
                } catch (error) {
                    console.error("Error fetching jenis data:", error);
                }
            };

            const fetchDataKondisi = async () => {
                try {
                    const response = await fetch(`${API_URL}/mkondisi`, {
                        headers: { Authorization: `Bearer ${TOKEN}` },
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch jenis data");
                    }

                    const data = await response.json();
                    setKondisi(data.eksisting);
                } catch (error) {
                    console.error("Error fetching jenis data:", error);
                }
            };

            // Jalankan semua fetch secara paralel
            Promise.all([
                fetchDataEksisting(),
                fetchDataJenis(),
                fetchDataKondisi(),
            ]).catch((error) => {
                console.error("Error fetching initial data:", error);
            });
        }, []);

        console.log("TABLE STREET RENDER");

        const data = useMemo(() => {
            const sourceData =
                title == "Eksisting"
                    ? eksisting
                    : title == "Jenis"
                    ? jenis
                    : title == "Kondisi"
                    ? kondisi
                    : null;

            return (sourceData as any[]).map((item) => {
                const filterKey =
                    title === "Eksisting"
                        ? "eksisting_id"
                        : title === "Jenis"
                        ? "jenisjalan_id"
                        : title === "Kondisi"
                        ? "kondisi_id"
                        : "kondisi_id";

                const count = streets.filter(
                    (s) => s[filterKey] === item.id
                ).length;

                if (title === "Eksisting") {
                    return {
                        id: item.id,
                        name: item.eksisting,
                        count,
                    };
                }
                if (title === "Jenis") {
                    return {
                        id: item.id,
                        name: item.jenisjalan,
                        count,
                    };
                }
                if (title === "Kondisi") {
                    return {
                        id: item.id,
                        name: item.kondisi,
                        count,
                    };
                }
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
                            <TableRow key={item?.id}>
                                <TableCell className="font-medium">
                                    {item?.name}
                                </TableCell>
                                <TableCell>{item?.count}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }
);
