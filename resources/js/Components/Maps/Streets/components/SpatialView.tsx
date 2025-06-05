import { SearchAddress } from "@/Components/SearchAddress";
import { StreetControls } from "./StreetControls";
import { StreetList } from "./StreetList";
import StreetLegend from "./StreetLegend";
import { Skeleton } from "@/Components/ui/skeleton";
import { StreetMap } from "./StreetMap";
import {
    FilterStateInterface,
    GeocodingResponseInterface,
    StreetWithCoordinatesInterface,
} from "@/types/types";
import { memo } from "react";

interface SpatialViewProps {
    streets: StreetWithCoordinatesInterface[];
    filteredStreets: StreetWithCoordinatesInterface[];
    loading: boolean;
    selectedStreet: StreetWithCoordinatesInterface | null;
    mapKey: number;
    address: GeocodingResponseInterface;
    filters: FilterStateInterface;
    mapCenter: [number, number];
    handleCenterMap: (coords: [number, number]) => void;
    handleSelectedStreet: (street: StreetWithCoordinatesInterface) => void;
    handleFilterChange: (filters: FilterStateInterface) => void;
    handleSearch: (search: string) => void;
    handleMapKeyChange: () => void;
    handleSelectAddress: (address: GeocodingResponseInterface) => void;
    handleDeleted: (streetId: number) => void;
}

const SpatialView = memo(
    ({
        streets,
        filteredStreets,
        loading,
        selectedStreet,
        mapKey,
        address,
        filters,
        mapCenter,
        handleCenterMap,
        handleSelectedStreet,
        handleFilterChange,
        handleSearch,
        handleMapKeyChange,
        handleSelectAddress,
        handleDeleted,
    }: SpatialViewProps) => {
        return (
            <div className="gap-8 grid grid-cols-1 lg:grid-cols-4 mt-8">
                <div>
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
                    <StreetLegend handleMapKeyChange={handleMapKeyChange} />
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
