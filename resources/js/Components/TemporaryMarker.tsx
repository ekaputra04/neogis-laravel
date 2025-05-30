import { LatLng } from "leaflet";
import { useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";

export function TemporaryMarker() {
    const [marker, setMarker] = useState<LatLng | null>(null);

    useMapEvents({
        click(e) {
            setMarker(e.latlng);
        },
    });

    if (!marker) return null;

    // URL Google Street View berdasarkan koordinat marker
    const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${marker.lat},${marker.lng}`;

    return (
        <Marker position={marker}>
            <Popup>
                <div>
                    <strong>Marker</strong>
                    <br />
                    Koordinat: {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                    <br />
                    <a
                        href={streetViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: "#1a73e8",
                            textDecoration: "underline",
                        }}
                    >
                        Buka Google Street View
                    </a>
                </div>
            </Popup>
        </Marker>
    );
}
