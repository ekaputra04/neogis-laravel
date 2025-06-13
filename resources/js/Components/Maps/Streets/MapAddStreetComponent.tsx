import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head } from "@inertiajs/react";
import { FeatureGroup, MapContainer, Polyline, Popup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import { useCallback, useEffect, useState } from "react";
import {
    CoordinatesInterface,
    GeocodingResponseInterface,
    StreetInterface,
    StreetWithCoordinatesInterface,
} from "@/types/types";
import { Skeleton } from "@/Components/ui/skeleton";
import HowToUse from "@/Components/HowToUseComponent";
import { HowToUseStreetAdd } from "@/consts/howToUse";
import UploadFileDialog from "@/Components/UploadFileDialog";
import { centerPoints } from "@/consts/centerPoints";
import { MapCenterLayerUpdater } from "@/Components/MapCenterUpdater";
import { SearchAddress } from "@/Components/SearchAddress";
import FormAddStreet from "./components/FormAddStreet";
import { TemporaryMarker } from "@/Components/TemporaryMarker";
import LoadingView from "@/Components/LoadingView";
import { decode } from "@mapbox/polyline";
import { roundToTwo } from "@/lib/utils";
import {
    EksistingJalan,
    JenisJalan,
    KondisiJalan,
} from "@/consts/streetProperties";

interface DrawCreatedEvent {
    layerType: string;
    layer: L.Layer;
}

interface DrawEditedEvent {
    layers: L.LayerGroup;
}

export default function MapAddStreetComponent() {
    const TOKEN = localStorage.getItem("external_api_token") as string;
    const API_URL = import.meta.env.VITE_API_URL;

    console.log("MAP ADD STREET RENDER");

    const [streets, setStreets] = useState<StreetWithCoordinatesInterface[]>(
        []
    );
    const [mapCenter, setMapCenter] = useState<CoordinatesInterface>({
        latitude: centerPoints[0],
        longitude: centerPoints[1],
    });
    const [streetCoordinates, setStreetCoordinates] = useState<
        CoordinatesInterface[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [mapKey, setMapKey] = useState(0);
    const [address, setAddress] = useState<GeocodingResponseInterface>();

    const handleCreated = (e: DrawCreatedEvent) => {
        const { layer } = e;

        if (layer instanceof L.Polyline) {
            const latLngs = layer.getLatLngs() as L.LatLng[];

            const coordinates: CoordinatesInterface[] = latLngs.map(
                (latLng) => ({
                    latitude: latLng.lat,
                    longitude: latLng.lng,
                })
            );

            setStreetCoordinates(coordinates);
        }
    };

    const handleEdited = (e: DrawEditedEvent) => {
        const event = e as DrawEditedEvent;

        let updatedCoordinates: CoordinatesInterface[] = [];
        let formattedCoordinates: [number, number][] = [];

        event.layers.eachLayer((layer) => {
            if (layer instanceof L.Polyline) {
                const latLngs = layer.getLatLngs() as L.LatLng[];

                updatedCoordinates = latLngs.map((latLng) => ({
                    latitude: latLng.lat,
                    longitude: latLng.lng,
                }));

                formattedCoordinates =
                    latLngs.map((latLng): [number, number] => [
                        latLng.lat,
                        latLng.lng,
                    ]) ?? [];
            }
        });

        setStreetCoordinates(updatedCoordinates);
    };

    const handleDeleted = (e: any) => {
        e.layers.eachLayer((layer: any) => {
            if (layer instanceof L.Polyline) {
                setStreetCoordinates([]);
            }
        });
    };

    function handleSelectAddress(address: GeocodingResponseInterface) {
        setAddress(address);
    }

    const handleSetMapCenter = (center: CoordinatesInterface) => {
        setMapCenter(center);
    };

    const handleLoading = useCallback((loading: boolean) => {
        setLoading(loading);
    }, []);

    const handleStreetCoordinates = useCallback(
        (coordinates: CoordinatesInterface[]) => {
            setStreetCoordinates(coordinates);
        },
        []
    );

    useEffect(() => {
        if (streetCoordinates.length == 0) {
            setMapKey((prevKey) => prevKey + 1);
        }
    }, [streetCoordinates]);

    useEffect(() => {
        if (address) {
            handleSetMapCenter({
                latitude: Number((address as GeocodingResponseInterface).lat),
                longitude: Number((address as GeocodingResponseInterface)?.lon),
            });
        }
    }, [address]);

    useEffect(() => {
        const fetchDataStreets = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/ruasjalan`, {
                    headers: { Authorization: `Bearer ${TOKEN}` },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch locations data");
                }

                const data = await response.json();

                const streets: StreetWithCoordinatesInterface[] = (
                    data.ruasjalan as StreetInterface[]
                ).map((street) => {
                    return {
                        ...street,
                        coordinates: decode(street.paths).map(([lat, lng]) => [
                            lat,
                            lng,
                        ]),
                    };
                });

                setStreets(streets);
            } catch (error) {
                console.error("Error fetching streets data:", error);
            } finally {
                setLoading(false);
            }
        };

        Promise.all([fetchDataStreets()]).catch((error) => {
            console.error("Error fetching initial data:", error);
        });
    }, []);

    return (
        <>
            {loading && <LoadingView />}
            <DashboardMapLayout currentPath={"/dashboard/street/add"}>
                <Head title="Add Street" />
                <div className="flex justify-between items-start">
                    <h2 className="mb-4 font-bold text-slate-900 dark:text-white text-3xl">
                        Add Street
                    </h2>
                    <UploadFileDialog
                        loading={loading}
                        setLoading={handleLoading}
                    />
                </div>
                <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
                    <div className="">
                        <HowToUse tutorials={HowToUseStreetAdd} />
                        <SearchAddress
                            handleSelectAddress={handleSelectAddress}
                            addressId={address?.place_id || 0}
                        />

                        <FormAddStreet
                            loading={loading}
                            setLoading={handleLoading}
                            setStreetCoordinates={handleStreetCoordinates}
                            streetCoordinates={streetCoordinates}
                        />
                    </div>
                    <div className="md:col-span-2">
                        {loading ? (
                            <>
                                <Skeleton className="w-full h-screen" />
                            </>
                        ) : (
                            <MapContainer
                                key={mapKey}
                                center={[
                                    mapCenter.latitude,
                                    mapCenter.longitude,
                                ]}
                                zoom={13}
                                style={{ height: "500px", width: "100%" }}
                                className="z-10"
                            >
                                <MapCenterLayerUpdater
                                    address={address!!}
                                    mapCenter={mapCenter}
                                />

                                <FeatureGroup>
                                    <EditControl
                                        position="topright"
                                        onCreated={handleCreated}
                                        onEdited={handleEdited}
                                        onDeleted={handleDeleted}
                                        draw={{
                                            rectangle: false,
                                            polygon: false,
                                            circle: false,
                                            marker: false,
                                            polyline:
                                                streetCoordinates?.length == 0,
                                            circlemarker: false,
                                        }}
                                    />
                                </FeatureGroup>

                                {streets.map((street, idx) => {
                                    let color = "gray";
                                    let weight = 3;

                                    return (
                                        <div key={idx}>
                                            <Polyline
                                                key={street.id}
                                                positions={street.coordinates}
                                                color={color}
                                                weight={weight}
                                                dashArray={"10, 10"}
                                            >
                                                <Popup>
                                                    <strong>
                                                        {street.nama_ruas ||
                                                            "Jalan Tanpa Nama"}
                                                    </strong>
                                                    <br />
                                                    <br />
                                                    {street.keterangan ||
                                                        "Tidak ada deskripsi"}
                                                    <br />
                                                    <br />
                                                    Panjang:{" "}
                                                    {roundToTwo(
                                                        street.panjang
                                                    ) || "-"}{" "}
                                                    meter
                                                    <br />
                                                    <br />
                                                    Lebar:{" "}
                                                    {roundToTwo(street.lebar) ||
                                                        "-"}{" "}
                                                    meter
                                                    <br />
                                                    <br />
                                                    Eksisting:{" "}
                                                    {EksistingJalan.find(
                                                        (item) =>
                                                            item.id ==
                                                            street.eksisting_id
                                                    )?.eksisting || "-"}
                                                    <br />
                                                    <br />
                                                    Jenis:{" "}
                                                    {JenisJalan.find(
                                                        (item) =>
                                                            item.id ==
                                                            street.jenisjalan_id
                                                    )?.jenisjalan || "-"}
                                                    <br />
                                                    <br />
                                                    Kondisi:{" "}
                                                    {KondisiJalan.find(
                                                        (item) =>
                                                            item.id ==
                                                            street.kondisi_id
                                                    )?.kondisi || "-"}
                                                    <br />
                                                    <br />
                                                </Popup>
                                            </Polyline>
                                        </div>
                                    );
                                })}
                                <TemporaryMarker />
                            </MapContainer>
                        )}
                    </div>
                </div>
            </DashboardMapLayout>
        </>
    );
}
