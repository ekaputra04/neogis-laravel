import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { buttonOutlineCss } from "@/consts/buttonCss";
import { Filter } from "lucide-react";
import { usePage } from "@inertiajs/react";
import Checkbox from "@/Components/Checkbox";
import { Label } from "@/Components/ui/label";
import {
    EksistingJalanInterface,
    FilterStateInterface,
    JenisJalanInterface,
    KondisiJalanInterface,
} from "@/types/types";
import { ChangeEvent, memo, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface DialogFilterStreetComponentProps {
    onFilterChange: (filters: FilterStateInterface) => void;
    initialFilters?: FilterStateInterface;
}

const TOKEN = localStorage.getItem("external_api_token") as string;
const API_URL = import.meta.env.VITE_API_URL;

const DialogFilterStreetComponent = memo(
    ({ onFilterChange, initialFilters }: DialogFilterStreetComponentProps) => {
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

        // State untuk menyimpan nilai checkbox
        const [eksistingChecks, setEksistingChecks] = useState<
            Record<string, boolean>
        >(initialFilters?.eksisting as Record<string, boolean>);
        const [jenisChecks, setJenisChecks] = useState<Record<string, boolean>>(
            initialFilters?.jenis as Record<string, boolean>
        );
        const [kondisiChecks, setKondisiChecks] = useState<
            Record<string, boolean>
        >(initialFilters?.kondisi as Record<string, boolean>);

        // Handler untuk eksisting
        const handleAllEksistingChange = (e: ChangeEvent<HTMLInputElement>) => {
            const checked = e.target.checked;
            const newChecks: Record<string, boolean> = {};
            (eksisting as EksistingJalanInterface[]).forEach((item) => {
                newChecks[item.id] = checked;
            });
            setEksistingChecks(newChecks);
        };

        const handleEksistingChange =
            (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
                const checked = e.target.checked;
                setEksistingChecks((prev) => ({
                    ...prev,
                    [id]: checked,
                }));
            };

        // Handler untuk jenis
        const handleAllJenisChange = (e: ChangeEvent<HTMLInputElement>) => {
            const checked = e.target.checked;
            const newChecks: Record<string, boolean> = {};
            (jenis as JenisJalanInterface[]).forEach((item) => {
                newChecks[item.id] = checked;
            });
            setJenisChecks(newChecks);
        };

        const handleJenisChange =
            (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
                const checked = e.target.checked;
                setJenisChecks((prev) => ({
                    ...prev,
                    [id]: checked,
                }));
            };

        // Handler untuk kondisi
        const handleAllKondisiChange = (e: ChangeEvent<HTMLInputElement>) => {
            const checked = e.target.checked;
            const newChecks: Record<string, boolean> = {};
            (kondisi as KondisiJalanInterface[]).forEach((item) => {
                newChecks[item.id] = checked;
            });
            setKondisiChecks(newChecks);
        };

        const handleKondisiChange =
            (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
                const checked = e.target.checked;
                setKondisiChecks((prev) => ({
                    ...prev,
                    [id]: checked,
                }));
            };

        // Cek apakah semua item dalam grup terpilih
        const isAllEksistingChecked = (
            eksisting as EksistingJalanInterface[]
        ).every((item) => eksistingChecks[item.id]);

        const isAllJenisChecked = (jenis as JenisJalanInterface[]).every(
            (item) => jenisChecks[item.id]
        );

        const isAllKondisiChecked = (kondisi as KondisiJalanInterface[]).every(
            (item) => kondisiChecks[item.id]
        );

        const handleApply = useCallback(() => {
            onFilterChange({
                eksisting: eksistingChecks,
                jenis: jenisChecks,
                kondisi: kondisiChecks,
            });
            toast.success("Filter applied successfully!");
        }, [eksistingChecks, jenisChecks, kondisiChecks, onFilterChange]);

        // Inisialisasi checkbox state dengan semua terpilih
        useEffect(() => {
            // Inisialisasi eksisting
            const initialEksisting: Record<string, boolean> = {};
            (eksisting as EksistingJalanInterface[]).forEach((item) => {
                initialEksisting[item.id] = true;
            });
            setEksistingChecks(initialEksisting);

            // Inisialisasi jenis
            const initialJenis: Record<string, boolean> = {};
            (jenis as JenisJalanInterface[]).forEach((item) => {
                initialJenis[item.id] = true;
            });
            setJenisChecks(initialJenis);

            // Inisialisasi kondisi
            const initialKondisi: Record<string, boolean> = {};
            (kondisi as KondisiJalanInterface[]).forEach((item) => {
                initialKondisi[item.id] = true;
            });
            setKondisiChecks(initialKondisi);
        }, [eksisting, jenis, kondisi]);

        return (
            <AlertDialog>
                <AlertDialogTrigger
                    className={
                        buttonOutlineCss +
                        " flex w-full mt-4 bg-green-200 border-green-600 border hover:bg-green-300 "
                    }
                >
                    <Filter className="w-4 h-4" color="black" />
                    <p className="text-black">Filter</p>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Filter Street</AlertDialogTitle>
                        <AlertDialogDescription>
                            Filter with criteria below
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="gap-4 grid grid-cols-1 md:grid-cols-3 mt-4">
                        {/* Eksisting Section */}
                        <div className="">
                            <Label className="font-semibold">Eksisting</Label>
                            <div className="flex items-center space-x-2 mt-2 pb-2 border-b">
                                <Checkbox
                                    id="allEksisting"
                                    checked={isAllEksistingChecked}
                                    onChange={handleAllEksistingChange}
                                />
                                <label
                                    htmlFor="allEksisting"
                                    className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                                >
                                    All Eksisting
                                </label>
                            </div>
                            {(eksisting as EksistingJalanInterface[]).map(
                                (item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center space-x-2 mt-2"
                                    >
                                        <Checkbox
                                            id={`eksisting-${item.id}`}
                                            checked={!!eksistingChecks[item.id]}
                                            onChange={handleEksistingChange(
                                                item.id.toString()
                                            )}
                                        />
                                        <label
                                            htmlFor={`eksisting-${item.id}`}
                                            className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                                        >
                                            {item.eksisting}
                                        </label>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Jenis Section */}
                        <div className="">
                            <Label className="font-semibold">Jenis</Label>
                            <div className="flex items-center space-x-2 mt-2 pb-2 border-b">
                                <Checkbox
                                    id="allJenis"
                                    checked={isAllJenisChecked}
                                    onChange={handleAllJenisChange}
                                />
                                <label
                                    htmlFor="allJenis"
                                    className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                                >
                                    All Jenis
                                </label>
                            </div>
                            {(jenis as JenisJalanInterface[]).map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center space-x-2 mt-2"
                                >
                                    <Checkbox
                                        id={`jenis-${item.id}`}
                                        checked={!!jenisChecks[item.id]}
                                        onChange={handleJenisChange(
                                            item.id.toString()
                                        )}
                                    />
                                    <label
                                        htmlFor={`jenis-${item.id}`}
                                        className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                                    >
                                        {item.jenisjalan}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Kondisi Section */}
                        <div className="">
                            <Label className="font-semibold">Kondisi</Label>
                            <div className="flex items-center space-x-2 mt-2 pb-2 border-b">
                                <Checkbox
                                    id="allKondisi"
                                    checked={isAllKondisiChecked}
                                    onChange={handleAllKondisiChange}
                                />
                                <label
                                    htmlFor="allKondisi"
                                    className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                                >
                                    All Kondisi
                                </label>
                            </div>
                            {(kondisi as KondisiJalanInterface[]).map(
                                (item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center space-x-2 mt-2"
                                    >
                                        <Checkbox
                                            id={`kondisi-${item.id}`}
                                            checked={!!kondisiChecks[item.id]}
                                            onChange={handleKondisiChange(
                                                item.id.toString()
                                            )}
                                        />
                                        <label
                                            htmlFor={`kondisi-${item.id}`}
                                            className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                                        >
                                            {item.kondisi}
                                        </label>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleApply}>
                            Apply
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }
);
export default DialogFilterStreetComponent;
