import { useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import "leaflet/dist/leaflet.css";
import "@/leaflet/leaflet.css";
import "@/leaflet/leaflet";
import L from "leaflet";
import DashboardMapLayout from "@/Layouts/DashboardMapLayout";

export default function Map() {
    const { currentPath } = usePage().props;

    useEffect(() => {
        // Inisialisasi peta ketika komponen sudah render
        const map = L.map("map").setView([-8.65, 115.21], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap",
        }).addTo(map);

        L.marker([-6.2, 106.816666])
            .addTo(map)
            .bindPopup("Jakarta <br> Ibukota Indonesia")
            .openPopup();

        // Clean up map saat komponen unmount
        return () => {
            map.remove();
        };
    }, []);

    return (
        <DashboardMapLayout currentPath={currentPath as string}>
            <Head title="Maps" />
            <div
                id="map"
                className="z-0"
                style={{ height: "500px", width: "100%" }}
            ></div>
        </DashboardMapLayout>
    );
}
