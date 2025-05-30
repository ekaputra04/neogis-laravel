import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface EksistingJalanInterface {
    id: number;
    eksisting: string;
    color: string;
}

interface JenisJalanInterface {
    id: number;
    jenisjalan: string;
    color: string;
}

interface KondisiJalanInterface {
    id: number;
    kondisi: string;
    color: string;
}

export type LegendType = "eksisting" | "jenis" | "kondisi";

interface StreetLegendStore {
    type: LegendType;
    setType: (type: LegendType) => void;
    eksisting: EksistingJalanInterface[];
    jenis: JenisJalanInterface[];
    kondisi: KondisiJalanInterface[];
}

const eksistingData: EksistingJalanInterface[] = [
    { id: 1, eksisting: "Tanah", color: "#8B4513" },
    { id: 2, eksisting: "Tanah/Beton", color: "#A0522D" },
    { id: 3, eksisting: "Perkerasan", color: "#696969" },
    { id: 4, eksisting: "Koral", color: "#B0C4DE" },
    { id: 5, eksisting: "Lapen", color: "#2F4F4F" },
    { id: 6, eksisting: "Paving", color: "#708090" },
    { id: 7, eksisting: "Hotmix", color: "#000000" },
    { id: 8, eksisting: "Beton", color: "#D3D3D3" },
    { id: 9, eksisting: "Beton/Lapen", color: "#808080" },
];

const jenisData: JenisJalanInterface[] = [
    { id: 1, jenisjalan: "Desa", color: "#32CD32" },
    { id: 2, jenisjalan: "Kabupaten", color: "#FFD700" },
    { id: 3, jenisjalan: "Provinsi", color: "#FF4500" },
];

const kondisiData: KondisiJalanInterface[] = [
    { id: 1, kondisi: "Baik", color: "#008000" },
    { id: 2, kondisi: "Sedang", color: "#FFA500" },
    { id: 3, kondisi: "Rusak", color: "#FF0000" },
];

export const useStreetLegendStore = create<StreetLegendStore>()(
    persist(
        (set) => ({
            type: "eksisting",
            setType: (type: LegendType) => set({ type }),
            eksisting: eksistingData,
            jenis: jenisData,
            kondisi: kondisiData,
        }),
        {
            name: "street-legend-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ type: state.type }),
        }
    )
);
