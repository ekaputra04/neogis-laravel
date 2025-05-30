import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface EksistingJalanInterface {
    id: number;
    eksisting: string;
    color: string;
    weight: number;
}

interface JenisJalanInterface {
    id: number;
    jenisjalan: string;
    color: string;
    weight: number;
}

interface KondisiJalanInterface {
    id: number;
    kondisi: string;
    color: string;
    weight: number;
}

export type LegendType = "eksisting" | "jenis" | "kondisi";

interface StreetLegendStore {
    type: LegendType;
    setType: (type: LegendType) => void;
    eksisting: EksistingJalanInterface[];
    jenis: JenisJalanInterface[];
    kondisi: KondisiJalanInterface[];
    setColor: (type: LegendType, id: number, color: string) => void;
    setWeight: (type: LegendType, id: number, weight: number) => void;
}

const eksistingData: EksistingJalanInterface[] = [
    { id: 1, eksisting: "Tanah", color: "#8B4513", weight: 2 }, // Tipis untuk tanah
    { id: 2, eksisting: "Tanah/Beton", color: "#A0522D", weight: 3 },
    { id: 3, eksisting: "Perkerasan", color: "#696969", weight: 4 },
    { id: 4, eksisting: "Koral", color: "#B0C4DE", weight: 3 },
    { id: 5, eksisting: "Lapen", color: "#2F4F4F", weight: 5 },
    { id: 6, eksisting: "Paving", color: "#708090", weight: 4 },
    { id: 7, eksisting: "Hotmix", color: "#000000", weight: 6 }, // Tebal untuk hotmix
    { id: 8, eksisting: "Beton", color: "#D3D3D3", weight: 6 },
    { id: 9, eksisting: "Beton/Lapen", color: "#808080", weight: 5 },
];

const jenisData: JenisJalanInterface[] = [
    { id: 1, jenisjalan: "Desa", color: "#32CD32", weight: 3 }, // Tipis untuk desa
    { id: 2, jenisjalan: "Kabupaten", color: "#FFD700", weight: 5 },
    { id: 3, jenisjalan: "Provinsi", color: "#FF4500", weight: 7 }, // Tebal untuk provinsi
];

const kondisiData: KondisiJalanInterface[] = [
    { id: 1, kondisi: "Baik", color: "#008000", weight: 6 }, // Tebal untuk baik
    { id: 2, kondisi: "Sedang", color: "#FFA500", weight: 4 },
    { id: 3, kondisi: "Rusak", color: "#FF0000", weight: 2 }, // Tipis untuk rusak
];

export const useStreetLegendStore = create<StreetLegendStore>()(
    persist(
        (set) => ({
            type: "eksisting",
            setType: (type: LegendType) => set({ type }),
            eksisting: eksistingData,
            jenis: jenisData,
            kondisi: kondisiData,
            setColor: (type: LegendType, id: number, color: string) =>
                set((state) => {
                    if (type === "eksisting") {
                        return {
                            eksisting: state.eksisting.map((item) =>
                                item.id === id ? { ...item, color } : item
                            ),
                        };
                    } else if (type === "jenis") {
                        return {
                            jenis: state.jenis.map((item) =>
                                item.id === id ? { ...item, color } : item
                            ),
                        };
                    } else if (type === "kondisi") {
                        return {
                            kondisi: state.kondisi.map((item) =>
                                item.id === id ? { ...item, color } : item
                            ),
                        };
                    }
                    return state;
                }),
            setWeight: (type: LegendType, id: number, weight: number) =>
                set((state) => {
                    if (type === "eksisting") {
                        return {
                            eksisting: state.eksisting.map((item) =>
                                item.id === id ? { ...item, weight } : item
                            ),
                        };
                    } else if (type === "jenis") {
                        return {
                            jenis: state.jenis.map((item) =>
                                item.id === id ? { ...item, weight } : item
                            ),
                        };
                    } else if (type === "kondisi") {
                        return {
                            kondisi: state.kondisi.map((item) =>
                                item.id === id ? { ...item, weight } : item
                            ),
                        };
                    }
                    return state;
                }),
        }),
        {
            name: "street-legend-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
