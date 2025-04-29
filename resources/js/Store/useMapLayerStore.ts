import { tileLayers } from "@/consts/tileLayers";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MapLayerStore {
    selectedLayer: keyof typeof tileLayers;
    setSelectedLayer: (layer: keyof typeof tileLayers) => void;
}

export const useMapLayerStore = create<MapLayerStore>()(
    persist(
        (set) => ({
            selectedLayer: "OpenStreetMap",
            setSelectedLayer: (layer) => set({ selectedLayer: layer }),
        }),
        {
            name: "map-layer-storage",
        }
    )
);
