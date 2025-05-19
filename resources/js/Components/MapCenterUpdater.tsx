import { tileLayers } from "@/consts/tileLayers";
import { useMapLayerStore } from "@/Store/useMapLayerStore";
import {
    CoordinatesInterface,
    GeocodingResponseInterface,
} from "@/types/types";
import { memo, useEffect } from "react";
import { Polygon, Popup, TileLayer, useMap } from "react-leaflet";

export const MapCenterUpdater = ({ center }: { center: [number, number] }) => {
    const map = useMap();

    useEffect(() => {
        map.flyTo(center, map.getZoom());
    }, [center, map]);

    return null;
};

interface MapCenterLayerUpdaterProps {
    mapCenter: CoordinatesInterface;
    address: GeocodingResponseInterface;
}

export const MapCenterLayerUpdater = memo(
    ({ mapCenter, address }: MapCenterLayerUpdaterProps) => {
        const { selectedLayer } = useMapLayerStore();

        console.log("MAP CENTER LAYER RENDER");

        return (
            <div className="">
                <MapCenterUpdater
                    center={[mapCenter.latitude, mapCenter.longitude]}
                />
                <TileLayer url={tileLayers[selectedLayer]} />
                {address && (
                    <Polygon
                        key={address.place_id}
                        positions={[
                            [
                                [
                                    parseFloat(address.boundingbox[0]),
                                    parseFloat(address.boundingbox[2]),
                                ],
                                [
                                    parseFloat(address.boundingbox[0]),
                                    parseFloat(address.boundingbox[3]),
                                ],
                                [
                                    parseFloat(address.boundingbox[1]),
                                    parseFloat(address.boundingbox[3]),
                                ],
                                [
                                    parseFloat(address.boundingbox[1]),
                                    parseFloat(address.boundingbox[2]),
                                ],
                                [
                                    parseFloat(address.boundingbox[0]),
                                    parseFloat(address.boundingbox[2]),
                                ],
                            ],
                        ]}
                        color="green"
                    >
                        <Popup>
                            <strong>{address.type}</strong>
                            <br />
                            {address.display_name}
                        </Popup>
                    </Polygon>
                )}
            </div>
        );
    }
);
