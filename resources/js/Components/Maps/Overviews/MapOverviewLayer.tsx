import { customIcon } from "@/Components/CustomMarkerIcon";
import { MapCenterLayerUpdater } from "@/Components/MapCenterUpdater";
import { SearchAddress } from "@/Components/SearchAddress";
import { TemporaryMarker } from "@/Components/TemporaryMarker";
import { Badge } from "@/Components/ui/badge";
import {
    CircleInterface,
    CoordinatesInterface,
    GeocodingResponseInterface,
    LineInterface,
    MarkerInterface,
    PolygonInterface,
} from "@/types/types";
import { memo, useEffect, useState } from "react";
import {
    Circle,
    MapContainer,
    Marker,
    Polygon,
    Polyline,
    Popup,
    TileLayer,
    useMap,
} from "react-leaflet";

interface MapOverviewLayerProps {
    mapCenter: CoordinatesInterface;
    markers: MarkerInterface[];
    lines: LineInterface[];
    polygons: PolygonInterface[];
    circles: CircleInterface[];
    handleSetMapCenter: (center: CoordinatesInterface) => void;
}

export const MapOverviewLayer = memo(
    ({
        mapCenter,
        markers,
        lines,
        polygons,
        circles,
        handleSetMapCenter,
    }: MapOverviewLayerProps) => {
        const [address, setAddress] = useState<GeocodingResponseInterface>();

        console.log("MAP OVERVIEW LAYER RENDER");

        function handleSelectAddress(address: GeocodingResponseInterface) {
            setAddress(address);
        }

        useEffect(() => {
            if (address) {
                handleSetMapCenter({
                    latitude: Number(
                        (address as GeocodingResponseInterface).lat
                    ),
                    longitude: Number(
                        (address as GeocodingResponseInterface)?.lon
                    ),
                });
            }
        }, [address]);

        return (
            <div className="space-y-4 mt-8">
                <SearchAddress
                    handleSelectAddress={handleSelectAddress}
                    addressId={address?.place_id || 0}
                />
                <div className="z-0 relative mb-8">
                    <MapContainer
                        center={[mapCenter.latitude, mapCenter.longitude]}
                        zoom={16}
                        style={{ height: "500px", width: "100%" }}
                    >
                        <MapCenterLayerUpdater
                            address={address!!}
                            mapCenter={mapCenter}
                        />

                        {markers &&
                            markers.map((marker, index) => (
                                <Marker
                                    key={index}
                                    position={[
                                        marker.latitude,
                                        marker.longitude,
                                    ]}
                                    icon={customIcon}
                                >
                                    <Popup>
                                        {marker.name ? (
                                            <strong>{marker.name}</strong>
                                        ) : (
                                            "Lokasi tanpa nama"
                                        )}
                                        <br />
                                        {marker.description ||
                                            "Tidak ada deskripsi"}
                                        <br />
                                        <br />
                                        {marker.category_name && (
                                            <>
                                                <Badge variant={"default"}>
                                                    {marker.category_name}
                                                </Badge>
                                            </>
                                        )}
                                    </Popup>
                                </Marker>
                            ))}

                        {lines &&
                            lines.map((line) => (
                                <Polyline
                                    key={line.id}
                                    positions={line.coordinates}
                                    color={line.color || "blue"}
                                >
                                    <Popup>
                                        {line.name ? (
                                            <strong>{line.name}</strong>
                                        ) : (
                                            "Lokasi tanpa nama"
                                        )}
                                        <br />
                                        <br />
                                        {line.description ||
                                            "Tidak ada deskripsi"}
                                        <br />
                                        <br />
                                        {line.category_name && (
                                            <>
                                                <Badge variant={"default"}>
                                                    {line.category_name}
                                                </Badge>
                                            </>
                                        )}
                                    </Popup>
                                </Polyline>
                            ))}

                        {polygons &&
                            polygons.map((polygon) => (
                                <Polygon
                                    key={polygon.id}
                                    positions={polygon.coordinates}
                                    color={polygon.color || "blue"}
                                >
                                    <Popup>
                                        {polygon.name ? (
                                            <strong>{polygon.name}</strong>
                                        ) : (
                                            "Lokasi tanpa nama"
                                        )}
                                        <br />
                                        <br />
                                        {polygon.description ||
                                            "Tidak ada deskripsi"}
                                        <br />
                                        <br />
                                        {polygon.category_name && (
                                            <>
                                                <Badge variant={"default"}>
                                                    {polygon.category_name}
                                                </Badge>
                                            </>
                                        )}
                                    </Popup>
                                </Polygon>
                            ))}

                        {circles &&
                            circles.map((circle) => (
                                <Circle
                                    key={circle.id}
                                    center={[circle.latitude, circle.longitude]}
                                    radius={circle.radius}
                                    color={circle.color || "blue"}
                                >
                                    <Popup>
                                        {circle.name ? (
                                            <strong>{circle.name}</strong>
                                        ) : (
                                            "Lokasi tanpa nama"
                                        )}
                                        <br />
                                        <br />
                                        {circle.description ||
                                            "Tidak ada deskripsi"}
                                        <br />
                                        <br />
                                        {circle.category_name && (
                                            <>
                                                <Badge variant={"default"}>
                                                    {circle.category_name}
                                                </Badge>
                                            </>
                                        )}
                                    </Popup>
                                </Circle>
                            ))}
                        <TemporaryMarker />
                    </MapContainer>
                </div>
            </div>
        );
    }
);
