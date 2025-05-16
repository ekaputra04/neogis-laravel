import { KabupatenInterface, ProvinsiInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";

export default function StreetLocation() {
    const { provinsi, kabupaten, kecamatan, desa } = usePage().props;

    return (
        <div className="">
            <div className="">
                {(provinsi as ProvinsiInterface[]).map((provinsi) => (
                    <p>{provinsi.provinsi}</p>
                ))}
            </div>
        </div>
    );
}
