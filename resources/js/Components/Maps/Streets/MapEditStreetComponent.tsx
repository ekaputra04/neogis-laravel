import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head, router, usePage } from "@inertiajs/react";
import {
    FeatureGroup,
    MapContainer,
    Polyline,
    Popup,
    TileLayer,
} from "react-leaflet";
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
import { useEffect, useState } from "react";
import {
    CategoriesInterface,
    CoordinatesInterface,
    DesaInterface,
    EksistingJalanInterface,
    JenisJalanInterface,
    KabupatenInterface,
    KecamatanInterface,
    KondisiJalanInterface,
    LineInterface,
    ProvinsiInterface,
    SelectedDesaInterface,
    SelectedKabupatenInterface,
    SelectedKecamatanInterface,
    SelectedProvinsiInterface,
    StreetInterface,
    StreetWithCoordinatesInterface,
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
import { useMapLayerStore } from "@/Store/useMapLayerStore";
import { tileLayers } from "@/consts/tileLayers";
import { decode, encode } from "@mapbox/polyline";
import { capitalizeWords, roundToTwo } from "@/lib/utils";
import { Label } from "@/Components/ui/label";
import { length, lineString } from "@turf/turf";

const formSchema = z.object({
    desa_id: z.number(),
    kode_ruas: z.string().min(2).max(50),
    nama_ruas: z.string().min(2).max(50),
    panjang: z.number(),
    lebar: z.number(),
    eksisting_id: z.number(),
    kondisi_id: z.number(),
    jenisjalan_id: z.number(),
    keterangan: z.string().min(2).max(255),
});

interface DrawCreatedEvent {
    layerType: string;
    layer: L.Layer;
}

interface DrawEditedEvent {
    layers: L.LayerGroup;
}

export default function MapEditStreetComponent() {
    const {
        street: initialStreet,
        provinsi,
        kabupaten,
        kecamatan,
        desa,
        eksisting,
        jenis,
        kondisi,
        token,
        selectedProvinsi,
        selectedKabupaten,
        selectedKecamatan,
        selectedDesa,
    } = usePage().props;

    const { selectedLayer } = useMapLayerStore();
    const [street, setStreet] = useState<StreetWithCoordinatesInterface>({
        ...(initialStreet as StreetInterface),
        coordinates: decode((initialStreet as StreetInterface).paths).map(
            ([lat, lng]) => [lat, lng]
        ) as [number, number][],
    });

    const [streetCoordinates, setStreetCoordinates] = useState<
        CoordinatesInterface[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [mapKey, setMapKey] = useState(0);
    const [filteredKabupaten, setFilteredKabupaten] = useState<
        KabupatenInterface[]
    >([]);
    const [filteredKecamatan, setFilteredKecamatan] = useState<
        KecamatanInterface[]
    >([]);
    const [filteredDesa, setFilteredDesa] = useState<DesaInterface[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nama_ruas: street.nama_ruas,
            keterangan: street.keterangan,
            lebar: street.lebar,
            desa_id: street.desa_id,
            eksisting_id: street.eksisting_id,
            jenisjalan_id: street.jenisjalan_id,
            kode_ruas: street.kode_ruas,
            kondisi_id: street.kondisi_id,
            panjang: street.panjang,
        },
    });

    const handleFilterKabupaten = (provinsiId: number) => {
        const kab = (kabupaten as KabupatenInterface[]).filter(
            (kabupaten) => kabupaten.prov_id === provinsiId
        );
        setFilteredKabupaten(kab);
    };

    const handleFilterKecamatan = (kabupatenId: number) => {
        const kec = (kecamatan as KecamatanInterface[]).filter(
            (kecamatan) => kecamatan.kab_id === kabupatenId
        );
        setFilteredKecamatan(kec);
    };

    const handleFilterDesa = (kecamatanId: number) => {
        const des = (desa as DesaInterface[]).filter(
            (desa) => desa.kec_id === kecamatanId
        );
        setFilteredDesa(des);
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!streetCoordinates) {
            toast.error("Please add a street coordinates first.");
            return;
        }

        const formattedCoordinates: [number, number][] = streetCoordinates.map(
            (coord): [number, number] => [coord.latitude, coord.longitude]
        );

        const encodeCoordinates = encode(formattedCoordinates);

        const formBody = new URLSearchParams();
        formBody.append("paths", encodeCoordinates);
        formBody.append("desa_id", values.desa_id.toString());
        formBody.append("kode_ruas", values.kode_ruas);
        formBody.append("nama_ruas", values.nama_ruas);
        formBody.append("panjang", values.panjang.toString());
        formBody.append("lebar", values.lebar.toString());
        formBody.append("eksisting_id", values.eksisting_id.toString());
        formBody.append("kondisi_id", values.kondisi_id.toString());
        formBody.append("jenisjalan_id", values.jenisjalan_id.toString());
        formBody.append("keterangan", values.keterangan);

        setLoading(true);

        try {
            const response = await fetch(
                "https://gisapis.manpits.xyz/api/ruasjalan",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${token}`,
                    },
                    body: formBody.toString(),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API error response:", errorText);
                throw new Error("Failed to save street to external API.");
            }

            const result = await response.json();
            console.log("API success:", result);

            toast.success("Street saved successfully to external API!");
            form.reset();
            setStreetCoordinates([]);
        } catch (error) {
            console.error("Error saving street:", error);
            toast.error("Error saving street.");
        } finally {
            setLoading(false);
        }
    }

    const handleCreated = (e: DrawCreatedEvent) => {
        const { layer } = e;

        if (layer instanceof L.Polyline) {
            // Ambil seluruh koordinat polyline
            const latLngs = layer.getLatLngs() as L.LatLng[];

            // Transformasikan koordinat ke format yang sesuai
            const coordinates: CoordinatesInterface[] = latLngs.map(
                (latLng) => ({
                    latitude: latLng.lat,
                    longitude: latLng.lng,
                })
            );

            // Simpan koordinat tersebut ke dalam state (atau tempat lain yang sesuai)
            setStreetCoordinates(coordinates);

            const formattedCoordinates: [number, number][] =
                latLngs.map((latLng): [number, number] => [
                    latLng.lat,
                    latLng.lng,
                ]) ?? [];

            const line = lineString(formattedCoordinates);
            const distanceInMeter = length(line, { units: "meters" });
            form.setValue("panjang", distanceInMeter);
        }
    };

    const handleEdited = (e: DrawEditedEvent) => {
        const event = e as DrawEditedEvent;

        // Variabel untuk menyimpan seluruh koordinat polyline yang diedit
        let updatedCoordinates: CoordinatesInterface[] = [];
        let formattedCoordinates: [number, number][] = [];

        event.layers.eachLayer((layer) => {
            if (layer instanceof L.Polyline) {
                // Ambil seluruh koordinat polyline yang diedit
                const latLngs = layer.getLatLngs() as L.LatLng[];

                // Map koordinat ke format yang sesuai
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

        // Update state dengan koordinat yang telah diedit
        setStreetCoordinates(updatedCoordinates);

        const line = lineString(formattedCoordinates);
        const distanceInMeter = length(line, { units: "meters" });
        form.setValue("panjang", distanceInMeter);
    };

    const handleDeleted = (e: any) => {
        e.layers.eachLayer((layer: any) => {
            if (layer instanceof L.Polyline) {
                setStreetCoordinates([]);
                form.setValue("panjang", 0);
            }
        });
    };

    useEffect(() => {
        if (streetCoordinates === null) {
            setMapKey((prevKey) => prevKey + 1);
        }
    }, [streetCoordinates]);

    return (
        <>
            <DashboardMapLayout currentPath={"/dashboard/street/edit"}>
                <Head title="Edit Line" />

                {JSON.stringify(selectedDesa)}
                <br />
                {JSON.stringify(selectedKecamatan)}
                <br />
                {JSON.stringify(selectedKabupaten)}
                <br />
                {JSON.stringify(selectedProvinsi)}
                <br />
                {JSON.stringify(provinsi)}
                <br />
                {JSON.stringify(kabupaten)}
                <br />
                {JSON.stringify(street)}
                <br />

                <h2 className="mb-4 font-bold text-slate-900 dark:text-white text-3xl">
                    Edit Street
                </h2>
                <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
                    <div className="">
                        {loading ? (
                            <>
                                <FormSkeleton count={2} />
                            </>
                        ) : (
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-4"
                                >
                                    <FormField
                                        control={form.control}
                                        name="nama_ruas"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nama</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Nama..."
                                                        {...field}
                                                        disabled={loading}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="kode_ruas"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Kode</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Kode..."
                                                        {...field}
                                                        disabled={loading}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="keterangan"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Keterangan
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Keterangan"
                                                        {...field}
                                                        disabled={loading}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="gap-4 grid grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Panjang (m)</Label>
                                            <Input
                                                type="number"
                                                placeholder="Panjang"
                                                value={roundToTwo(
                                                    form.getValues("panjang")
                                                )}
                                                disabled
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="lebar"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Lebar (m)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Lebar"
                                                            // {...field}
                                                            value={field.value}
                                                            disabled={loading}
                                                            type="number"
                                                            onChange={(e) => {
                                                                form.setValue(
                                                                    "lebar",
                                                                    Number(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Provinsi</Label>
                                        <Select
                                            onValueChange={(value) => {
                                                setFilteredKabupaten([]);
                                                setFilteredKecamatan([]);
                                                setFilteredDesa([]);
                                                handleFilterKabupaten(
                                                    Number(value)
                                                );
                                            }}
                                            value={
                                                (
                                                    provinsi as ProvinsiInterface[]
                                                )
                                                    .find(
                                                        (provinsi) =>
                                                            provinsi.id ==
                                                            (
                                                                selectedProvinsi as SelectedProvinsiInterface
                                                            ).id
                                                    )
                                                    ?.id.toString() ?? ""
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Provinsi" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(
                                                    provinsi as ProvinsiInterface[]
                                                ).map((provinsi) => (
                                                    <SelectItem
                                                        value={provinsi.id.toString()}
                                                        key={provinsi.id}
                                                    >
                                                        {capitalizeWords(
                                                            provinsi.provinsi
                                                        )}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Kabupaten</Label>
                                        <Select
                                            onValueChange={(value) => {
                                                setFilteredKecamatan([]);
                                                setFilteredDesa([]);
                                                handleFilterKecamatan(
                                                    Number(value)
                                                );
                                            }}
                                            // disabled={
                                            //     filteredKabupaten.length == 0
                                            // }
                                            value={
                                                (
                                                    kabupaten as KabupatenInterface[]
                                                )
                                                    .find(
                                                        (kabupaten) =>
                                                            kabupaten.id ==
                                                            (
                                                                selectedKabupaten as SelectedKabupatenInterface
                                                            ).id
                                                    )
                                                    ?.id.toString() ?? ""
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue
                                                    placeholder={
                                                        filteredKabupaten.length >
                                                        0
                                                            ? "Kabupaten"
                                                            : "Please select provinsi first"
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filteredKabupaten.map(
                                                    (kabupaten) => (
                                                        <SelectItem
                                                            value={kabupaten.id.toString()}
                                                            key={kabupaten.id}
                                                        >
                                                            {capitalizeWords(
                                                                kabupaten.kabupaten
                                                            )}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Kecamatan</Label>
                                        <Select
                                            onValueChange={(value) => {
                                                setFilteredDesa([]);
                                                handleFilterDesa(Number(value));
                                            }}
                                            // disabled={
                                            //     filteredKecamatan.length == 0
                                            // }
                                            defaultValue={
                                                (
                                                    kecamatan as KecamatanInterface[]
                                                )
                                                    .find(
                                                        (kecamatan) =>
                                                            kecamatan.id ==
                                                            (
                                                                selectedKecamatan as SelectedKecamatanInterface
                                                            ).id
                                                    )
                                                    ?.id.toString() ?? ""
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue
                                                    placeholder={
                                                        filteredKecamatan.length >
                                                        0
                                                            ? "Kecamatan"
                                                            : "Please select kabupaten first"
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filteredKecamatan.map(
                                                    (kecamatan) => (
                                                        <SelectItem
                                                            value={kecamatan.id.toString()}
                                                            key={kecamatan.id}
                                                        >
                                                            {capitalizeWords(
                                                                kecamatan.kecamatan
                                                            )}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Desa</Label>
                                        <Select
                                            onValueChange={(value) => {
                                                form.setValue(
                                                    "desa_id",
                                                    Number(value)
                                                );
                                            }}
                                            // disabled={filteredDesa.length == 0}
                                            // value={street.desa_id.toString()}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue
                                                    placeholder={
                                                        filteredDesa.length > 0
                                                            ? "Desa"
                                                            : "Please select kecamatan first"
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filteredDesa.map((desa) => (
                                                    <SelectItem
                                                        value={desa.id.toString()}
                                                        key={desa.id}
                                                    >
                                                        {capitalizeWords(
                                                            desa.desa
                                                        )}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Eksisting</Label>
                                        <Select
                                            onValueChange={(value) => {
                                                form.setValue(
                                                    "eksisting_id",
                                                    Number(value)
                                                );
                                            }}
                                            value={street.eksisting_id.toString()}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Eksisting" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(
                                                    eksisting as EksistingJalanInterface[]
                                                ).map((eksisting) => (
                                                    <SelectItem
                                                        value={eksisting.id.toString()}
                                                        key={eksisting.id}
                                                    >
                                                        {eksisting.eksisting}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Kondisi</Label>
                                        <Select
                                            onValueChange={(value) => {
                                                form.setValue(
                                                    "kondisi_id",
                                                    Number(value)
                                                );
                                            }}
                                            value={street.kondisi_id.toString()}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Kondisi" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(
                                                    kondisi as KondisiJalanInterface[]
                                                ).map((eksisting) => (
                                                    <SelectItem
                                                        value={eksisting.id.toString()}
                                                        key={eksisting.id}
                                                    >
                                                        {eksisting.kondisi}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Jenis</Label>
                                        <Select
                                            onValueChange={(value) => {
                                                form.setValue(
                                                    "jenisjalan_id",
                                                    Number(value)
                                                );
                                            }}
                                            value={street.jenisjalan_id.toString()}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Jenis" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(
                                                    jenis as JenisJalanInterface[]
                                                ).map((eksisting) => (
                                                    <SelectItem
                                                        value={eksisting.id.toString()}
                                                        key={eksisting.id}
                                                    >
                                                        {eksisting.jenisjalan}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button type="submit" disabled={loading}>
                                        {loading
                                            ? "Adding Street..."
                                            : "Add Street"}
                                    </Button>
                                </form>
                            </Form>
                        )}
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
                                    street.coordinates[0][0],
                                    street.coordinates[0][1],
                                ]}
                                zoom={13}
                                style={{ height: "500px", width: "100%" }}
                                className="z-10"
                            >
                                <TileLayer url={tileLayers[selectedLayer]} />

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
                                                streetCoordinates?.length === 0,
                                            circlemarker: false,
                                        }}
                                    />

                                    <Polyline
                                        key={street.id}
                                        positions={street.coordinates}
                                        color={"blue"}
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
                                            {roundToTwo(street.panjang) ||
                                                "-"}{" "}
                                            meter
                                            <br />
                                            <br />
                                            Lebar: {street.lebar || "-"} meter
                                        </Popup>
                                    </Polyline>
                                </FeatureGroup>
                            </MapContainer>
                        )}
                    </div>
                </div>
            </DashboardMapLayout>
        </>
    );
}
