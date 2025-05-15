import MapOverviewLineComponent from "@/Components/Maps/Lines/MapOverviewLineComponent";
import { StreetInterface } from "@/types/types";
import { Head, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { decode, encode } from "@mapbox/polyline";

export default function MapOverviewStreet() {
    const { streets: initialStreets, apiResponse } = usePage().props;

    const [streets, setStreets] = useState<StreetInterface[]>(
        initialStreets as StreetInterface[]
    );

    const encodedPolyline = "l`is@asr~T@UHiAZyCD_D";
    const decodedCoordinates = decode(encodedPolyline);
    const encoded = encode(decodedCoordinates);

    return (
        <>
            <Head title="Streets" />
            <div className="">
                {JSON.stringify(streets)}
                <hr />
                {JSON.stringify(apiResponse)}
                <hr />
                {JSON.stringify(decodedCoordinates)}
                <hr />
                {encoded}
                <ul>
                    {streets.map((street) => (
                        <li key={street.id}>
                            <strong>{street.nama_ruas}</strong> -{" "}
                            {street.keterangan}
                        </li>
                    ))}
                </ul>
                {/* <MapOverviewLineComponent
                    currentPath={currentPath as string}
                    lines={lines as LineInterface[]}
                /> */}
                {/* {streets.map((ruas) => (
                    <li key={ruas.id} className="shadow p-2 border rounded">
                        <p>
                            <strong>Nama:</strong> {ruas.nama_ruas}
                        </p>
                        <p>
                            <strong>Kode:</strong> {ruas.kode_ruas}
                        </p>
                        <p>
                            <strong>Panjang:</strong> {ruas.panjang} m
                        </p>
                        <p>
                            <strong>Lebar:</strong> {ruas.lebar} m
                        </p>
                        <p>
                            <strong>Path:</strong> {ruas.paths}
                        </p>
                        <p>
                            <strong>Keterangan:</strong> {ruas.keterangan}
                        </p>
                    </li>
                ))} */}
            </div>
        </>
    );
}
