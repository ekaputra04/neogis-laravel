import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { FeatureGroup, MapContainer } from "react-leaflet";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import { useCallback, useEffect, useState } from "react";
import {
    CategoriesInterface,
    CoordinatesInterface,
    DesaInterface,
    EksistingJalanInterface,
    GeocodingResponseInterface,
    JenisJalanInterface,
    KabupatenInterface,
    KecamatanInterface,
    KondisiJalanInterface,
    ProvinsiInterface,
} from "@/types/types";
import { toast } from "sonner";
import FormSkeleton from "@/Components/FormSkeleton";
import { Skeleton } from "@/Components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import HowToUse from "@/Components/HowToUseComponent";
import { HowToUseStreetAdd } from "@/consts/howToUse";
import { Label } from "@/Components/ui/label";
import { capitalizeWords, roundToTwo } from "@/lib/utils";
import { encode } from "@mapbox/polyline";
import { lineString, length } from "@turf/turf";
import UploadFileDialog from "@/Components/UploadFileDialog";
import { centerPoints } from "@/consts/centerPoints";
import { MapCenterLayerUpdater } from "@/Components/MapCenterUpdater";
import { SearchAddress } from "@/Components/SearchAddress";
import FormAddStreet from "./components/FormAddStreet";

interface DrawCreatedEvent {
    layerType: string;
    layer: L.Layer;
}

interface DrawEditedEvent {
    layers: L.LayerGroup;
}

export default function MapAddStreetComponent() {
    console.log("MAP ADD STREET RENDER");

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

    return (
        <>
            <DashboardMapLayout currentPath={"/dashboard/street/add"}>
                <Head title="Add Street" />
                <div className="flex justify-between items-start">
                    <h2 className="mb-4 font-bold text-slate-900 dark:text-white text-3xl">
                        Add Street
                    </h2>
                    <UploadFileDialog />
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
                            </MapContainer>
                        )}
                    </div>
                </div>
            </DashboardMapLayout>
        </>
    );
}
