import { usePage } from "@inertiajs/react";
import MapOverviewStreetComponent from "@/Components/Maps/Streets/MapOverviewStreetComponent";
import { StreetInterface } from "@/types/types";

export default function MapOverviewStreet() {
    const { streets, token } = usePage().props;

    return (
        <MapOverviewStreetComponent
            streets={streets as StreetInterface[]}
            token={token as string}
        />
    );
}
