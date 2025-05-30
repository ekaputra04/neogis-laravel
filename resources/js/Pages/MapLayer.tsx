import { TemporaryMarker } from "@/Components/TemporaryMarker";
import { centerPoints } from "@/consts/centerPoints";
import { tileLayerAttributtions, tileLayers } from "@/consts/tileLayers";
import { useMapLayerStore } from "@/Store/useMapLayerStore";
import { MapContainer, TileLayer } from "react-leaflet";

export default function MapLayer() {
    const { selectedLayer } = useMapLayerStore();
    return (
        <div className="w-screen h-screen">
            <MapContainer
                center={[centerPoints[0], centerPoints[1]]}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url={tileLayers[selectedLayer]}
                    attribution={tileLayerAttributtions[selectedLayer]}
                />
                <TemporaryMarker />
            </MapContainer>
        </div>
    );
}
