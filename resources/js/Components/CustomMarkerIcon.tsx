import L from "leaflet";

// Gunakan new URL untuk memastikan path aset benar di production
const iconUrl = new URL("@/leaflet/images/marker-icon.png", import.meta.url)
    .href;
const iconRetinaUrl = new URL(
    "@/leaflet/images/marker-icon-2x.png",
    import.meta.url
).href;
const shadowUrl = new URL("@/leaflet/images/marker-shadow.png", import.meta.url)
    .href;

export const customIcon = new L.Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
    popupAnchor: [1, -34],
});
