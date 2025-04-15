import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head, router } from "@inertiajs/react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { MarkerCoordinatesInterface, MarkerInterface } from "@/types/types";
import { customIcon } from "@/Components/CustomMarkerIcon";
import { Button } from "@/Components/ui/button";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Eye } from "lucide-react";
import { centerPoints } from "@/Consts/centerPoints";

export default function MapOverviewComponent({
    currentPath,
    markers,
}: {
    currentPath: string;
    markers: MarkerInterface[];
}) {
    // const [filteredMarkers, setFilteredMarkers] = useState<MarkerInterface[]>(
    //     markers ?? []
    // );
    const [mapCenter, setMapCenter] = useState<MarkerCoordinatesInterface>(
        markers && markers.length > 0
            ? {
                  latitude: markers[0].latitude,
                  longitude: markers[0].longitude,
              }
            : {
                  latitude: centerPoints[0], // fallback jika markers kosong
                  longitude: centerPoints[1],
              }
    );
    // const [searchValue, setSearchValue] = useState<string>("");

    // useEffect(() => {
    //     if (markers) {
    //         const filtered = markers.filter((marker) =>
    //             marker.name.toLowerCase().includes(searchValue.toLowerCase())
    //         );
    //         setFilteredMarkers(filtered);
    //     } else {
    //         setFilteredMarkers([]);
    //     }
    // }, [searchValue, markers]);

    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Maps" />
                <div className="gap-8 grid md:grid-cols-4">
                    <div className="">
                        <>
                            {/* <Input
                                placeholder="Search..."
                                className="mb-8"
                                onChange={(e) => setSearchValue(e.target.value)}
                            ></Input> */}
                            <Table className="">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="flex justify-between items-center">
                                            <p>Marker</p>
                                            <p>
                                                ({markers.length}/
                                                {markers.length})
                                            </p>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {markers.map((marker, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="flex justify-between items-center">
                                                {marker.name}
                                                <Button
                                                    variant={"outline"}
                                                    onClick={() =>
                                                        setMapCenter({
                                                            latitude:
                                                                marker.latitude,
                                                            longitude:
                                                                marker.longitude,
                                                        })
                                                    }
                                                >
                                                    <Eye />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </>
                    </div>
                    <div className="z-0 md:col-span-3">
                        <MapContainer
                            center={[mapCenter.latitude, mapCenter.longitude]}
                            zoom={16}
                            style={{ height: "500px", width: "100%" }}
                        >
                            <MapCenterUpdater
                                center={[
                                    mapCenter.latitude,
                                    mapCenter.longitude,
                                ]}
                            />
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
                                        </Popup>
                                    </Marker>
                                ))}
                        </MapContainer>
                    </div>
                </div>
            </DashboardMapLayout>
        </>
    );
}

const MapCenterUpdater = ({ center }: { center: [number, number] }) => {
    const map = useMap();

    useEffect(() => {
        map.flyTo(center, map.getZoom());
    }, [center, map]);

    return null;
};
