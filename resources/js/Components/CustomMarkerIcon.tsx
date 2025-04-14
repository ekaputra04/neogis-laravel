import iconUrl from "@/leaflet/images/marker-icon.png";
import iconRetinaUrl from "@/leaflet/images/marker-icon-2x.png";
import shadowUrl from "@/leaflet/images/marker-shadow.png";
import L from "leaflet";

export const customIcon = new L.Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
