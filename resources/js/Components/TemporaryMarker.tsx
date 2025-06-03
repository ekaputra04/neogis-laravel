import { LatLng } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";

export function TemporaryMarker() {
    const [marker, setMarker] = useState<LatLng | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    const map = useMapEvents({
        click(e) {
            setMarker(e.latlng);
        },
    });

    useEffect(() => {
        if (marker && markerRef.current) {
            markerRef.current.openPopup();
        }
    }, [marker]);

    if (!marker) return null;

    const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${marker.lat},${marker.lng}`;

    return (
        <Marker position={marker} ref={markerRef}>
            <Popup>
                <div>
                    <strong>Street View</strong>
                    <br />
                    Coordinates: {marker.lat.toFixed(6)},{" "}
                    {marker.lng.toFixed(6)}
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
