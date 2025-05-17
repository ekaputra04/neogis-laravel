import { Head, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { decode, encode } from "@mapbox/polyline";
import MapOverviewStreetComponent from "@/Components/Maps/Streets/MapOverviewStreetComponent";
import { StreetInterface } from "@/types/types";

export default function MapOverviewStreet() {
    const { streets, token } = usePage().props;

    // const [streets, setStreets] = useState<StreetInterface[]>(
    //     initialStreets as StreetInterface[]
    // );

    // const encodedPolyline = "l`is@asr~T@UHiAZyCD_D";
    // const decodedCoordinates = decode(encodedPolyline);
    // const encoded = encode(decodedCoordinates);

    return (
        <>
            <Head title="Streets" />
            <div className="">
                {/* {JSON.stringify(streets)} */}
                <MapOverviewStreetComponent
                    streets={streets as StreetInterface[]}
                    token={token as string}
                />
            </div>
        </>
    );
}
