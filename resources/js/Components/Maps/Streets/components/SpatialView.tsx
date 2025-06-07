import { SearchAddress } from "@/Components/SearchAddress";
import { StreetControls } from "./StreetControls";
import { StreetList } from "./StreetList";
import StreetLegend from "./StreetLegend";
import { Skeleton } from "@/Components/ui/skeleton";
import { StreetMap } from "./StreetMap";
import {
    CoordinatesInterface,
    FilterStateInterface,
    GeocodingResponseInterface,
    StreetWithCoordinatesInterface,
} from "@/types/types";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useStreetLegendStore } from "@/Store/useStreetLegendStore";
import { filterData } from "@/consts/filtersData";

interface SpatialViewProps {
    streets: StreetWithCoordinatesInterface[];
    mapCenter: [number, number];
    loading: boolean;
    mapKey: number;
    handleMapCenterChange: (coords: [number, number]) => void;
    handleDeleted: (id: number) => void;
    handleIsFullScreenChange: (isFullScreen: boolean) => void;
    handleMapKeyChange: () => void;
}

const SpatialView = memo(
    ({
        streets,
        mapCenter,
        loading,
        mapKey,
        handleMapCenterChange,
        handleDeleted,
        handleIsFullScreenChange,
        handleMapKeyChange,
    }: SpatialViewProps) => {
        const { type } = useStreetLegendStore();

        const [selectedStreet, setSelectedStreet] =
            useState<StreetWithCoordinatesInterface | null>();
        const [address, setAddress] = useState<GeocodingResponseInterface>();
        const [filters, setFilters] =
            useState<FilterStateInterface>(filterData);

        const [searchValue, setSearchValue] = useState("");

        const filteredStreets = useMemo(() => {
            if (!streets) return [];
            const { eksisting, jenis, kondisi } = filters;
            const searchLower = searchValue.toLowerCase();

            const allFiltersFalse =
                !Object.values(eksisting).some(Boolean) &&
                !Object.values(jenis).some(Boolean) &&
                !Object.values(kondisi).some(Boolean);

            if (allFiltersFalse) return [];

            return streets.filter((street) => {
                const eksistingMatch =
                    !Object.values(eksisting).some(Boolean) ||
                    eksisting[street.eksisting_id];
                const jenisMatch =
                    !Object.values(jenis).some(Boolean) ||
                    jenis[street.jenisjalan_id];
                const kondisiMatch =
                    !Object.values(kondisi).some(Boolean) ||
                    kondisi[street.kondisi_id];
                const nameMatch = street.nama_ruas
                    .toLowerCase()
                    .includes(searchLower);

                return (
                    eksistingMatch && jenisMatch && kondisiMatch && nameMatch
                );
            });
        }, [streets, filters, searchValue]);

        const handleCenterMap = useCallback((coords: [number, number]) => {
            handleMapCenterChange(coords);

            // rerender yang menyebabkan tidak bisa smooth flying
            handleMapKeyChange();
        }, []);

        const handleSelectedStreet = useCallback(
            (street: StreetWithCoordinatesInterface) => {
                setSelectedStreet(street);
            },
            []
        );

        const handleFilterChange = useCallback(
            (newFilters: FilterStateInterface) => {
                setFilters(newFilters);
            },
            []
        );

        const handleSearch = useCallback((value: string) => {
            setSearchValue(value);
        }, []);

        const handleSelectAddress = useCallback(
            (address: GeocodingResponseInterface) => {
                setAddress(address);
            },
            []
        );

        const handleSetMapCenter = (center: CoordinatesInterface) => {
            handleMapCenterChange([center.latitude, center.longitude]);
        };

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
            <div className="lg:gap-8 grid grid-cols-1 lg:grid-cols-4 w-full">
                <div className="w-full">
                    <SearchAddress
                        handleSelectAddress={handleSelectAddress}
                        addressId={address?.place_id || 0}
                    />
                    <StreetControls
                        onFilterChange={handleFilterChange}
                        onSearch={handleSearch}
                        initialFilters={filters}
                        streets={filteredStreets}
                    />
                    <StreetList
                        streetLength={streets.length}
                        filteredStreets={filteredStreets}
                        loading={loading}
                        selectedStreet={selectedStreet!!}
                        handleCenterMap={handleCenterMap}
                        handleSelectedStreet={handleSelectedStreet}
                    />
                </div>
                <div className="z-0 md:col-span-3">
                    <StreetLegend
                        isFullScreen={false}
                        handleMapKeyChange={handleMapKeyChange}
                        handleIsFullScreenChange={handleIsFullScreenChange}
                    />
                    <hr className="my-4" />
                    {loading ? (
                        <Skeleton className="w-full h-[500px]" />
                    ) : (
                        <StreetMap
                            key={mapKey}
                            selectedStreet={selectedStreet!!}
                            streets={filteredStreets}
                            onDelete={handleDeleted}
                            loading={loading}
                            address={address!!}
                            mapCenter={mapCenter}
                        />
                    )}
                </div>
            </div>
        );
    }
);

export default SpatialView;
