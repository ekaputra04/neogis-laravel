import {
    EksistingJalanInterface,
    JenisJalanInterface,
    KondisiJalanInterface,
} from "@/types/types";

export const EksistingJalan: EksistingJalanInterface[] = [
    {
        id: 1,
        eksisting: "Tanah",
    },
    {
        id: 2,
        eksisting: "Tanah/Beton",
    },
    {
        id: 3,
        eksisting: "Perkerasan",
    },
    {
        id: 4,
        eksisting: "Koral",
    },
    {
        id: 5,
        eksisting: "Lapen",
    },
    {
        id: 6,
        eksisting: "Paving",
    },
    {
        id: 7,
        eksisting: "Hotmix",
    },
    {
        id: 8,
        eksisting: "Beton",
    },
    {
        id: 9,
        eksisting: "Beton/Lapen",
    },
];

export const JenisJalan: JenisJalanInterface[] = [
    {
        id: 1,
        jenisjalan: "Desa",
    },
    {
        id: 2,
        jenisjalan: "Kabupaten",
    },
    {
        id: 3,
        jenisjalan: "Provinsi",
    },
];

export const KondisiJalan: KondisiJalanInterface[] = [
    {
        id: 1,
        kondisi: "Baik",
    },
    {
        id: 2,
        kondisi: "Sedang",
    },
    {
        id: 3,
        kondisi: "Rusak",
    },
];
