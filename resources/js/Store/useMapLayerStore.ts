import { tileLayers } from "@/consts/tileLayers";
import { create } from "zustand";

interface MapLayerStore {
    selectedLayer: keyof typeof tileLayers;
    setSelectedLayer: (layer: keyof typeof tileLayers) => void;
}

export const useMapLayerStore = create<MapLayerStore>((set) => ({
    selectedLayer: "OpenStreetMap",
    setSelectedLayer: (layer) => set({ selectedLayer: layer }),
}));
