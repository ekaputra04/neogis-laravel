import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head } from "@inertiajs/react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { MarkerInterface } from "@/types/types";
import L from "leaflet";
import iconUrl from "@/leaflet/images/marker-icon.png";
import iconRetinaUrl from "@/leaflet/images/marker-icon-2x.png";
import shadowUrl from "@/leaflet/images/marker-shadow.png";

const customIcon = new L.Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export default function MapOverviewMarkerComponent({
    currentPath,
    markers,
}: {
    currentPath: string;
    markers: MarkerInterface[];
}) {
    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Maps" />
                <div className="">
                    <MapContainer
                        center={[-8.65, 115.21]}
                        zoom={13}
                        style={{ height: "500px", width: "100%" }}
                        className="z-10"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {markers.map((marker, index) => (
                            <Marker
                                key={index}
                                position={[marker.latitude, marker.longitude]}
                                icon={customIcon}
                            >
                                <Popup>
                                    {marker.name ? (
                                        <strong>{marker.name}</strong>
                                    ) : (
                                        "Lokasi tanpa nama"
                                    )}{" "}
                                    <br />
                                    {marker.description ||
                                        "Tidak ada deskripsi"}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </DashboardMapLayout>
        </>
    );
}
