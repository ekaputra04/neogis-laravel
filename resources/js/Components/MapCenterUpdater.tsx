import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const MapCenterUpdater = ({ center }: { center: [number, number] }) => {
    const map = useMap();

    useEffect(() => {
        map.flyTo(center, map.getZoom());
    }, [center, map]);

    return null;
};
