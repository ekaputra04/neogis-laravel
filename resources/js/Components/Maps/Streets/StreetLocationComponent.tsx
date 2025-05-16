import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import {
    DesaInterface,
    KabupatenInterface,
    KecamatanInterface,
    ProvinsiInterface,
} from "@/types/types";
import { Head, usePage } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { capitalizeWords } from "@/lib/utils";

export default function StreetLocationComponent() {
    const { provinsi, kabupaten, kecamatan, desa } = usePage().props;

    const [selectedProvinsi, setSelectedProvinsi] = useState<number>();
    const [selectedKabupaten, setSelectedKabupaten] = useState<number>();
    const [selectedKecamatan, setSelectedKecamatan] = useState<number>();

    const [filteredProvinsi, setFilteredProvinsi] = useState<
        ProvinsiInterface[]
    >(provinsi as ProvinsiInterface[]);
    const [filteredKabupaten, setFilteredKabupaten] = useState<
        KabupatenInterface[]
    >([]);
    const [filteredKecamatan, setFilteredKecamatan] = useState<
        KecamatanInterface[]
    >([]);
    const [filteredDesa, setFilteredDesa] = useState<DesaInterface[]>([]);

    const handleFilterKabupaten = (provinsiId: number) => {
        const kab = (kabupaten as KabupatenInterface[]).filter(
            (kabupaten) => kabupaten.prov_id === provinsiId
        );
        setSelectedProvinsi(provinsiId);
        setFilteredKabupaten(kab);
    };
    const handleFilterKecamatan = (kabupatenId: number) => {
        const kec = (kecamatan as KecamatanInterface[]).filter(
            (kecamatan) => kecamatan.kab_id === kabupatenId
        );
        setSelectedKabupaten(kabupatenId);
        setFilteredKecamatan(kec);
    };
    const handleFilterDesa = (kecamatanId: number) => {
        const des = (desa as DesaInterface[]).filter(
            (desa) => desa.kec_id === kecamatanId
        );
        setSelectedKecamatan(kecamatanId);
        setFilteredDesa(des);
    };

    return (
        <>
            <DashboardMapLayout currentPath={"/dashboard/street/location"}>
                <Head title="Street Location" />
                <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    <div className="p-4 border rounded-lg h-fit">
                        <Table>
                            <TableCaption>
                                {filteredProvinsi.length} Provinsi found
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
                                                onClick={() => {
                                                    setFilteredKabupaten([]);
                                                    setFilteredKecamatan([]);
                                                    setFilteredDesa([]);
                                                    handleFilterKabupaten(
                                                        provinsi.id
                                                    );
                                                }}
                                            >
                                                <Eye />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="p-4 border rounded-lg h-fit">
                        <Table>
                            <TableCaption>
                                {filteredKabupaten.length} Kabupaten found
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
                                            {capitalizeWords(
                                                kabupaten.kabupaten
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant={"outline"}
                                                onClick={() => {
                                                    setFilteredKecamatan([]);
                                                    setFilteredDesa([]);
                                                    handleFilterKecamatan(
                                                        kabupaten.id
                                                    );
                                                }}
                                            >
                                                <Eye />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="p-4 border rounded-lg h-fit">
                        <Table>
                            <TableCaption>
                                {filteredKecamatan.length} Kecamatan found
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
                                            {capitalizeWords(
                                                kecamatan.kecamatan
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant={"outline"}
                                                onClick={() => {
                                                    setFilteredDesa([]);
                                                    handleFilterDesa(
                                                        kecamatan.id
                                                    );
                                                }}
                                            >
                                                <Eye />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="p-4 border rounded-lg h-fit">
                        <Table>
                            <TableCaption>
                                {filteredDesa.length} Desa found
                            </TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Kecamatan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDesa.map((desa, index) => (
                                    <TableRow key={desa.id}>
                                        <TableCell className="font-medium">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            {capitalizeWords(desa.desa)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </DashboardMapLayout>
        </>
    );
}
