import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { tileLayers } from "@/consts/tileLayers";
import { useMapLayerStore } from "@/Store/useMapLayerStore";
import { MapContainer, TileLayer } from "react-leaflet";

export default function MapLayerComponent() {
    const { selectedLayer, setSelectedLayer } = useMapLayerStore();

    return (
        <>
            <div className="space-y-6">
                <header>
                    <h2 className="font-medium text-gray-900 dark:text-white text-lg">
                        Map Layer
                    </h2>

                    <p className="mt-1 text-gray-600 dark:text-gray-200 text-sm">
                        Manage and update map layers to control what is
                        displayed on the map.
                    </p>
                </header>

                <div className="gap-4 md:gap-6 lg:gap-8 grid grid-cols-1 md:grid-cols-2">
                    <MapContainer
                        center={[-8.65, 115.21]}
                        zoom={13}
                        style={{ height: "200px", width: "100%" }}
                        className="z-10"
                    >
                        <TileLayer url={tileLayers[selectedLayer]} />
                    </MapContainer>
                    <Select
                        onValueChange={(value) =>
                            setSelectedLayer(value as keyof typeof tileLayers)
                        }
                        value={selectedLayer}
                    >
                        <SelectTrigger className="mb-8 w-full">
                            <SelectValue placeholder="Select map layer" />
                        </SelectTrigger>
                        <SelectContent className="z-50">
                            {Object.keys(tileLayers).map((key) => (
                                <SelectItem value={key} key={key}>
                                    {key}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </>
    );
}
