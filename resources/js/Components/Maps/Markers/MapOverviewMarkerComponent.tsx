import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head } from "@inertiajs/react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import {
    CoordinatesInterface,
    GeocodingResponseInterface,
    MarkerInterface,
} from "@/types/types";
import axios from "axios";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { centerPoints } from "@/consts/centerPoints";
import { MarkerMap } from "./components/MarkerMap";
import { ElementControls } from "@/Components/ElementControls";
import { ElementList } from "@/Components/ElementList";
import { SearchAddress } from "@/Components/SearchAddress";

interface MapOverviewMarkerComponentProps {
    markers: MarkerInterface[];
}
export default function MapOverviewMarkerComponent({
    markers: initialMarkers,
}: MapOverviewMarkerComponentProps) {
    console.log("MAP OVERVIEW MARKER RENDER");

    const [markers, setMarkers] = useState<MarkerInterface[]>(initialMarkers);
    const [filteredMarkers, setFilteredMarkers] =
        useState<MarkerInterface[]>(initialMarkers);
    const [address, setAddress] = useState<GeocodingResponseInterface>();
    const [mapCenter, setMapCenter] = useState<CoordinatesInterface>(
        markers && markers.length > 0
            ? {
                  latitude: markers[0].latitude,
                  longitude: markers[0].longitude,
              }
            : {
                  latitude: centerPoints[0],
                  longitude: centerPoints[1],
              }
    );
    const [searchValue, setSearchValue] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const fetchMarkers = useCallback(async (): Promise<void> => {
        try {
            const response = await axios.get(`/api/maps/markers`);
            if (response.status == 200) {
                setMarkers(response.data);
            }
        } catch (error: any) {
            console.error(error.response?.data?.message || error.message);
        }
    }, [initialMarkers]);

    const handleDeleted = useCallback(async (markerId: number) => {
        setLoading(true);
        try {
            const response = await axios.delete(
                `/api/maps/markers/${markerId}`
            );
            if (response.status == 200) {
                await fetchMarkers();
                toast.success("Marker deleted successfully!");
            }
            toast.success("Failed to delete marker!");
        } catch (error: any) {
            console.error(
                "Error deleting marker:",
                error.response?.data?.message || error.message
            );
            toast.error(
                error.response?.data?.message || "Gagal menghapus marker."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSearch = useCallback((value: string) => {
        setSearchValue(value);
    }, []);

    const handleCenterMap = useCallback((coords: CoordinatesInterface) => {
        setMapCenter({
            latitude: coords.latitude,
            longitude: coords.longitude,
        });
    }, []);

    const handleSelectAddress = useCallback(
        (address: GeocodingResponseInterface) => {
            setAddress(address);
        },
        []
    );

    const handleSetMapCenter = (center: CoordinatesInterface) => {
        setMapCenter(center);
    };

    useEffect(() => {
        if (markers) {
            const filtered = markers.filter((marker) =>
                marker.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredMarkers(filtered);
        } else {
            setFilteredMarkers([]);
        }
    }, [searchValue]);

    useEffect(() => {
        if (address) {
            handleSetMapCenter({
                latitude: Number((address as GeocodingResponseInterface).lat),
                longitude: Number((address as GeocodingResponseInterface).lon),
            });
        }
    }, [address]);

    return (
        <>
            <DashboardMapLayout currentPath={"/dashboard/marker"}>
                <Head title="Marker" />
                <div className="gap-8 grid md:grid-cols-4">
                    <div className="">
                        <SearchAddress
                            handleSelectAddress={handleSelectAddress}
                            addressId={address?.place_id || 0}
                        />
                        <ElementControls
                            elementType="marker"
                            onSearch={handleSearch}
                            elements={markers}
                        />
                        <ElementList
                            elementLength={markers?.length || 0}
                            loading={loading}
                            filteredElements={filteredMarkers}
                            onCenterMap={handleCenterMap}
                            type="marker"
                        />
                    </div>
                    <div className="z-0 md:col-span-3">
                        <MarkerMap
                            markers={markers}
                            address={address!!}
                            mapCenter={mapCenter}
                            onDelete={handleDeleted}
                        />
                    </div>
                </div>
            </DashboardMapLayout>
        </>
    );
}
