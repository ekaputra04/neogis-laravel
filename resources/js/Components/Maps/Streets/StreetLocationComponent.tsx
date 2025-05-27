import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import {
    DesaInterface,
    KabupatenInterface,
    KecamatanInterface,
    LocationCounterInterface,
    ProvinsiInterface,
} from "@/types/types";
import { Head } from "@inertiajs/react";
import { useCallback, useEffect, useState } from "react";
import DashboardCounterCard from "../DashboardCounterCard";
import { ProvinsiTable } from "./components/ProvinsiTable";
import { KabupatenTable } from "./components/KabupatenTable";
import { KecamatanTable } from "./components/KecamatanTable";
import { DesaTable } from "./components/DesaTable";

const TOKEN = localStorage.getItem("external_api_token") as string;
const API_URL = import.meta.env.VITE_API_URL;

export default function StreetLocationComponent() {
    const [provinsi, setProvinsi] = useState<ProvinsiInterface[]>([]);
    const [kabupaten, setKabupaten] = useState<KabupatenInterface[]>([]);
    const [kecamatan, setKecamatan] = useState<KecamatanInterface[]>([]);
    const [desa, setDesa] = useState<DesaInterface[]>([]);

    const [selectedProvinsi, setSelectedProvinsi] = useState<number>();
    const [selectedKabupaten, setSelectedKabupaten] = useState<number>();
    const [selectedKecamatan, setSelectedKecamatan] = useState<number>();

    const [filteredProvinsi, setFilteredProvinsi] = useState<
        ProvinsiInterface[]
    >([]);
    const [filteredKabupaten, setFilteredKabupaten] = useState<
        KabupatenInterface[]
    >([]);
    const [filteredKecamatan, setFilteredKecamatan] = useState<
        KecamatanInterface[]
    >([]);
    const [filteredDesa, setFilteredDesa] = useState<DesaInterface[]>([]);

    const LocationCounter: LocationCounterInterface[] = [
        {
            title: "Total Provinsi",
            value: (provinsi as ProvinsiInterface[]).length,
        },
        {
            title: "Total Kabupaten",
            value: (kabupaten as KabupatenInterface[]).length,
        },
        {
            title: "Total Kecamatan",
            value: (kecamatan as KecamatanInterface[]).length,
        },
        {
            title: "Total Desa",
            value: (desa as DesaInterface[]).length,
        },
    ];

    const handleFilterKabupaten = useCallback(
        (provinsiId: number) => {
            const kab = (kabupaten as KabupatenInterface[]).filter(
                (kabupaten) => kabupaten.prov_id === provinsiId
            );
            setSelectedProvinsi(provinsiId);
            setFilteredKabupaten(kab);
        },
        [kabupaten]
    );

    const handleFilterKecamatan = useCallback(
        (kabupatenId: number) => {
            const kec = (kecamatan as KecamatanInterface[]).filter(
                (kecamatan) => kecamatan.kab_id === kabupatenId
            );
            setSelectedKabupaten(kabupatenId);
            setFilteredKecamatan(kec);
        },
        [kecamatan]
    );

    const handleFilterDesa = useCallback(
        (kecamatanId: number) => {
            const des = (desa as DesaInterface[]).filter(
                (desa) => desa.kec_id === kecamatanId
            );
            setSelectedKecamatan(kecamatanId);
            setFilteredDesa(des);
        },
        [desa]
    );

    const handleSelectProvinsi = useCallback(
        (provinsiId: number) => {
            setFilteredKabupaten([]);
            setFilteredKecamatan([]);
            setFilteredDesa([]);
            handleFilterKabupaten(provinsiId);
        },
        [handleFilterKabupaten]
    );

    const handleSelectKabupaten = useCallback(
        (kabupatenId: number) => {
            setFilteredKecamatan([]);
            setFilteredDesa([]);
            handleFilterKecamatan(kabupatenId);
        },
        [handleFilterKecamatan]
    );

    const handleSelectKecamatan = useCallback(
        (kecamatanId: number) => {
            setFilteredDesa([]);
            handleFilterDesa(kecamatanId);
        },
        [handleFilterDesa]
    );

    console.log("STREET LOCATION RENDER");

    useEffect(() => {
        const fetchDataLocations = async () => {
            try {
                const response = await fetch(`${API_URL}/mregion`, {
                    headers: { Authorization: `Bearer ${TOKEN}` },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch locations data");
                }

                const data = await response.json();
                setProvinsi(data.provinsi);
                setKabupaten(data.kabupaten);
                setKecamatan(data.kecamatan);
                setDesa(data.desa);

                setFilteredProvinsi(data.provinsi);
            } catch (error) {
                console.error("Error fetching locations data:", error);
            }
        };

        Promise.all([fetchDataLocations()]).catch((error) => {
            console.error("Error fetching initial data:", error);
        });
    }, []);

    return (
        <>
            <DashboardMapLayout currentPath={"/dashboard/street/location"}>
                <Head title="Street Location" />

                <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {LocationCounter.map((counter, index) => (
                        <DashboardCounterCard
                            key={index}
                            title={counter.title}
                            value={counter.value}
                        />
                    ))}

                    <ProvinsiTable
                        filteredProvinsi={filteredProvinsi}
                        onSelectProvinsi={handleSelectProvinsi}
                        selectedProvinsi={selectedProvinsi}
                    />

                    <KabupatenTable
                        filteredKabupaten={filteredKabupaten}
                        onSelectKabupaten={handleSelectKabupaten}
                        selectedKabupaten={selectedKabupaten}
                    />

                    <KecamatanTable
                        filteredKecamatan={filteredKecamatan}
                        onSelectKecamatan={handleSelectKecamatan}
                        selectedKecamatan={selectedKecamatan}
                    />

                    <DesaTable filteredDesa={filteredDesa} />
                </div>
            </DashboardMapLayout>
        </>
    );
}
