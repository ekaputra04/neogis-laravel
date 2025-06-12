import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
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
    CoordinatesInterface,
    DesaInterface,
    EksistingJalanInterface,
    JenisJalanInterface,
    KabupatenInterface,
    KecamatanInterface,
    KondisiJalanInterface,
    ProvinsiInterface,
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
import { tileLayerAttributtions, tileLayers } from "@/consts/tileLayers";
import { decode, encode } from "@mapbox/polyline";
import { capitalizeWords, roundToTwo } from "@/lib/utils";
import { Label } from "@/Components/ui/label";
import { length, lineString } from "@turf/turf";
import { RefreshCcw } from "lucide-react";
import { buttonDestructiveCss } from "@/consts/buttonCss";
import HowToUseComponent from "@/Components/HowToUseComponent";
import { HowToUseStreetUpdate } from "@/consts/howToUse";
import { TemporaryMarker } from "@/Components/TemporaryMarker";

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
    paths: z.string(),
});

interface DrawCreatedEvent {
    layerType: string;
    layer: L.Layer;
}

interface DrawEditedEvent {
    layers: L.LayerGroup;
}

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN = localStorage.getItem("external_api_token") as string;

export default function MapEditStreetComponent() {
    const { id } = usePage().props;

    const { selectedLayer } = useMapLayerStore();
    const [provinsi, setProvinsi] = useState<ProvinsiInterface[]>([]);
    const [kabupaten, setKabupaten] = useState<KabupatenInterface[]>([]);
    const [kecamatan, setKecamatan] = useState<KecamatanInterface[]>([]);
    const [desa, setDesa] = useState<DesaInterface[]>([]);
    const [eksisting, setEksisting] = useState<EksistingJalanInterface[]>([]);
    const [jenis, setJenis] = useState<JenisJalanInterface[]>([]);
    const [kondisi, setKondisi] = useState<KondisiJalanInterface[]>([]);
    const [street, setStreet] = useState<StreetWithCoordinatesInterface>();
    const [loading, setLoading] = useState(false);
    const [mapKey, setMapKey] = useState(0);
    const [selectedProvinsiId, setSelectedProvinsiId] = useState<number>();
    const [selectedKabupatenId, setSelectedKabupatenId] = useState<number>();
    const [selectedKecamatanId, setSelectedKecamatanId] = useState<number>();
    const [selectedDesaId, setSelectedDesaId] = useState<number>();
    const [streetCoordinates, setStreetCoordinates] =
        useState<CoordinatesInterface[]>();
    const [filteredKabupaten, setFilteredKabupaten] = useState<
        KabupatenInterface[]
    >([]);
    const [filteredKecamatan, setFilteredKecamatan] = useState<
        KecamatanInterface[]
    >([]);
    const [filteredDesa, setFilteredDesa] = useState<DesaInterface[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
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
            const response = await fetch(`${API_URL}/ruasjalan/${street?.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${TOKEN}`,
                },
                body: formBody.toString(),
            });

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
            router.visit("/dashboard/street");
        } catch (error) {
            console.error("Error saving street:", error);
            toast.error("Error saving street.");
        } finally {
            setLoading(false);
        }
    }

    async function fetchLocation() {
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/mregion`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API error response:", errorText);
                throw new Error("Failed to save street to external API.");
            }

            const result = await response.json();
            const kabupatenData = result.kabupaten;
            const kecamatanData = result.kecamatan;
            const desaData = result.desa;

            setFilteredKabupaten(
                (kabupatenData as KabupatenInterface[]).filter((kabupaten) => {
                    return kabupaten.prov_id == selectedProvinsiId;
                })
            );
            setFilteredKecamatan(
                (kecamatanData as KecamatanInterface[]).filter((kecamatan) => {
                    return kecamatan.kab_id == selectedKabupatenId;
                })
            );
            setFilteredDesa(
                (desaData as DesaInterface[]).filter((desa) => {
                    return desa.kec_id == selectedKecamatanId;
                })
            );

            toast.success("Fetch location successfully!");
        } catch (error) {
            console.error("Error fetching location:", error);
            toast.error("Error fetching location.");
        } finally {
            setLoading(false);
        }
    }

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

    useEffect(() => {
        const fetchDataStreets = async () => {
            try {
                const response = await fetch(`${API_URL}/ruasjalan/${id}`, {
                    headers: { Authorization: `Bearer ${TOKEN}` },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch locations data");
                }

                const data = await response.json();

                const streetData = data.ruasjalan;

                console.log(streetData);

                if (!streetData) {
                    router.visit("/");
                }

                const decodedPaths = decode(streetData.paths);
                const streetWithCoordinates: StreetWithCoordinatesInterface = {
                    ...streetData,
                    paths: streetData.paths,
                    coordinates: decodedPaths.map(([latitude, longitude]) => [
                        latitude,
                        longitude,
                    ]),
                };

                console.log("Fetched street data:", streetWithCoordinates);

                form.setValue("nama_ruas", streetWithCoordinates.nama_ruas);
                form.setValue("keterangan", streetWithCoordinates.keterangan);
                form.setValue("lebar", streetWithCoordinates.lebar);
                form.setValue("desa_id", streetWithCoordinates.desa_id);
                form.setValue(
                    "eksisting_id",
                    streetWithCoordinates.eksisting_id
                );
                form.setValue(
                    "jenisjalan_id",
                    streetWithCoordinates.jenisjalan_id
                );
                form.setValue("kode_ruas", streetWithCoordinates.kode_ruas);
                form.setValue("kondisi_id", streetWithCoordinates.kondisi_id);
                form.setValue("panjang", streetWithCoordinates.panjang);
                form.setValue("paths", streetWithCoordinates.paths);

                const decoded = decode(streetData.paths);
                const coordinates = decoded.map(([latitude, longitude]) => ({
                    latitude,
                    longitude,
                }));

                setStreet(streetWithCoordinates);
                setStreetCoordinates(coordinates);
            } catch (error) {
                console.error("Error fetching streets data:", error);
            }
        };

        const fetchDataLocations = async () => {
            try {
                const response = await fetch(`${API_URL}/mregion`, {
                    headers: { Authorization: `Bearer ${TOKEN}` },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch locations data");
                }

                const data = await response.json();
                setProvinsi(data.provinsi);
                setKabupaten(data.kabupaten);
                setKecamatan(data.kecamatan);
                setDesa(data.desa);
            } catch (error) {
                console.error("Error fetching locations data:", error);
            }
        };

        const fetchDataEksisting = async () => {
            try {
                const response = await fetch(`${API_URL}/meksisting`, {
                    headers: { Authorization: `Bearer ${TOKEN}` },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch eksisting data");
                }

                const data = await response.json();
                setEksisting(data.eksisting);
            } catch (error) {
                console.error("Error fetching eksisting data:", error);
            }
        };

        const fetchDataJenis = async () => {
            try {
                const response = await fetch(`${API_URL}/mjenisjalan`, {
                    headers: { Authorization: `Bearer ${TOKEN}` },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch jenis data");
                }

                const data = await response.json();
                setJenis(data.eksisting);
            } catch (error) {
                console.error("Error fetching jenis data:", error);
            }
        };

        const fetchDataKondisi = async () => {
            try {
                const response = await fetch(`${API_URL}/mkondisi`, {
                    headers: { Authorization: `Bearer ${TOKEN}` },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch jenis data");
                }

                const data = await response.json();
                setKondisi(data.eksisting);
            } catch (error) {
                console.error("Error fetching jenis data:", error);
            }
        };

        Promise.all([
            fetchDataStreets(),
            fetchDataLocations(),
            fetchDataEksisting(),
            fetchDataJenis(),
            fetchDataKondisi(),
        ]).catch((error) => {
            console.error("Error fetching initial data:", error);
        });
    }, [id]);

    useEffect(() => {
        if (
            street &&
            provinsi.length > 0 &&
            kabupaten.length > 0 &&
            kecamatan.length > 0 &&
            desa.length > 0
        ) {
            const fetchDataStreetLocation = async (desaId: number) => {
                try {
                    const response = await fetch(
                        `${API_URL}/kecamatanbydesaid/${desaId}`,
                        {
                            headers: { Authorization: `Bearer ${TOKEN}` },
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Failed to fetch street location data");
                    }

                    const data = await response.json();
                    console.log("Fetched street location data:", data);

                    setSelectedProvinsiId(data.provinsi.id);
                    setSelectedKabupatenId(data.kabupaten.id);
                    setSelectedKecamatanId(data.kecamatan.id);
                    setSelectedDesaId(data.desa.id);

                    const filteredKabupaten = (
                        kabupaten as KabupatenInterface[]
                    ).filter((kabupaten) => {
                        return kabupaten.prov_id == data.provinsi.id;
                    });

                    setFilteredKabupaten(filteredKabupaten);
                    const filteredKecamatan = (
                        kecamatan as KecamatanInterface[]
                    ).filter((kecamatan) => {
                        return kecamatan.kab_id == data.kabupaten.id;
                    });
                    setFilteredKecamatan(filteredKecamatan);
                    const filteredDesa = (desa as DesaInterface[]).filter(
                        (desa) => {
                            return desa.kec_id == data.kecamatan.id;
                        }
                    );
                    setFilteredDesa(filteredDesa);
                } catch (error) {
                    console.error(
                        "Error fetching street location data:",
                        error
                    );
                }
            };

            fetchDataStreetLocation(street.desa_id);
        }
    }, [street, provinsi, kabupaten, kecamatan, desa]);

    return (
        <>
            <DashboardMapLayout currentPath={"/dashboard/street/edit"}>
                <Head title="Edit Line" />

                <h2 className="mb-4 font-bold text-slate-900 dark:text-white text-3xl">
                    Edit Street
                </h2>

                <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
                    <div className="">
                        <HowToUseComponent tutorials={HowToUseStreetUpdate} />
                        {loading ? (
                            <>
                                <FormSkeleton count={11} />
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
                                        {/* <div className="space-y-2">
                                            <Label>Panjang (m)</Label>
                                            <Input
                                                type="number"
                                                placeholder="Panjang"
                                                value={roundToTwo(
                                                    form.getValues("panjang")
                                                )}
                                                disabled
                                            />
                                        </div> */}

                                        <FormField
                                            control={form.control}
                                            name="panjang"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Panjang (m)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Panjang"
                                                            // {...field}
                                                            value={field.value}
                                                            disabled
                                                            type="number"
                                                            onChange={(e) => {
                                                                form.setValue(
                                                                    "panjang",
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

                                    {selectedProvinsiId &&
                                        provinsi.length > 0 && (
                                            <div className="space-y-2">
                                                <Label className="flex justify-between items-center">
                                                    <p>Provinsi</p>
                                                    <Button
                                                        variant={"outline"}
                                                        onClick={fetchLocation}
                                                    >
                                                        <RefreshCcw className="w-4 h-4" />
                                                    </Button>
                                                </Label>
                                                <Select
                                                    onValueChange={(value) => {
                                                        setSelectedProvinsiId(
                                                            Number(value)
                                                        );
                                                        setFilteredKabupaten(
                                                            []
                                                        );
                                                        setFilteredKecamatan(
                                                            []
                                                        );
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
                                                                    selectedProvinsiId
                                                            )
                                                            ?.id.toString() ??
                                                        ""
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
                                                                key={
                                                                    provinsi.id
                                                                }
                                                            >
                                                                {capitalizeWords(
                                                                    provinsi.provinsi
                                                                )}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                    {selectedKabupatenId &&
                                        kabupaten.length > 0 && (
                                            <div className="space-y-2">
                                                <Label>Kabupaten</Label>
                                                <Select
                                                    onValueChange={(value) => {
                                                        setSelectedKabupatenId(
                                                            Number(value)
                                                        );
                                                        setFilteredKecamatan(
                                                            []
                                                        );
                                                        setFilteredDesa([]);
                                                        handleFilterKecamatan(
                                                            Number(value)
                                                        );
                                                    }}
                                                    disabled={
                                                        filteredKabupaten.length ==
                                                        0
                                                    }
                                                    value={
                                                        selectedKabupatenId &&
                                                        filteredKabupaten.some(
                                                            (k) =>
                                                                k.id ==
                                                                selectedKabupatenId
                                                        )
                                                            ? selectedKabupatenId.toString()
                                                            : ""
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
                                                                    key={
                                                                        kabupaten.id
                                                                    }
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
                                        )}

                                    {selectedKecamatanId &&
                                        kecamatan.length > 0 && (
                                            <div className="space-y-2">
                                                <Label>Kecamatan</Label>
                                                <Select
                                                    onValueChange={(value) => {
                                                        setSelectedKecamatanId(
                                                            Number(value)
                                                        );
                                                        setFilteredDesa([]);
                                                        handleFilterDesa(
                                                            Number(value)
                                                        );
                                                    }}
                                                    disabled={
                                                        filteredKecamatan.length ==
                                                        0
                                                    }
                                                    value={
                                                        selectedKecamatanId &&
                                                        filteredKecamatan.some(
                                                            (k) =>
                                                                k.id ==
                                                                selectedKecamatanId
                                                        )
                                                            ? selectedKecamatanId.toString()
                                                            : ""
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
                                                                    key={
                                                                        kecamatan.id
                                                                    }
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
                                        )}

                                    {selectedDesaId && desa.length > 0 && (
                                        <div className="space-y-2">
                                            <Label>Desa</Label>
                                            <Select
                                                onValueChange={(value) => {
                                                    setSelectedDesaId(
                                                        Number(value)
                                                    );
                                                    form.setValue(
                                                        "desa_id",
                                                        Number(value)
                                                    );
                                                }}
                                                disabled={
                                                    filteredDesa.length == 0
                                                }
                                                value={
                                                    selectedDesaId &&
                                                    filteredDesa.some(
                                                        (k) =>
                                                            k.id ==
                                                            selectedDesaId
                                                    )
                                                        ? selectedDesaId.toString()
                                                        : ""
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue
                                                        placeholder={
                                                            filteredDesa.length >
                                                            0
                                                                ? "Desa"
                                                                : "Please select kecamatan first"
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filteredDesa.map(
                                                        (desa) => (
                                                            <SelectItem
                                                                value={desa.id.toString()}
                                                                key={desa.id}
                                                            >
                                                                {capitalizeWords(
                                                                    desa.desa
                                                                )}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {eksisting.length > 0 &&
                                        street?.eksisting_id && (
                                            <div className="space-y-2">
                                                <Label>Eksisting</Label>
                                                <Select
                                                    onValueChange={(value) => {
                                                        setStreet({
                                                            ...street!!,
                                                            eksisting_id:
                                                                Number(value),
                                                        });
                                                        form.setValue(
                                                            "eksisting_id",
                                                            Number(value)
                                                        );
                                                    }}
                                                    value={street!!.eksisting_id.toString()}
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
                                                                key={
                                                                    eksisting.id
                                                                }
                                                            >
                                                                {
                                                                    eksisting.eksisting
                                                                }
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                    {kondisi.length > 0 &&
                                        street?.kondisi_id && (
                                            <div className="space-y-2">
                                                <Label>Kondisi</Label>
                                                <Select
                                                    onValueChange={(value) => {
                                                        setStreet({
                                                            ...street!!,
                                                            kondisi_id:
                                                                Number(value),
                                                        });
                                                        form.setValue(
                                                            "kondisi_id",
                                                            Number(value)
                                                        );
                                                    }}
                                                    value={street!!.kondisi_id.toString()}
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
                                                                key={
                                                                    eksisting.id
                                                                }
                                                            >
                                                                {
                                                                    eksisting.kondisi
                                                                }
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                    {jenis.length > 0 &&
                                        street?.jenisjalan_id && (
                                            <div className="space-y-2">
                                                <Label>Jenis</Label>
                                                <Select
                                                    onValueChange={(value) => {
                                                        setStreet({
                                                            ...street!!,
                                                            jenisjalan_id:
                                                                Number(value),
                                                        });
                                                        form.setValue(
                                                            "jenisjalan_id",
                                                            Number(value)
                                                        );
                                                    }}
                                                    value={street!!.jenisjalan_id.toString()}
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
                                                                key={
                                                                    eksisting.id
                                                                }
                                                            >
                                                                {
                                                                    eksisting.jenisjalan
                                                                }
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                    <div className="flex justify-between items-center">
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading
                                                ? "Editing Street..."
                                                : "Edit Street"}
                                        </Button>
                                        <Link href="/dashboard/street">
                                            <div
                                                className={`${buttonDestructiveCss}`}
                                            >
                                                Cancel
                                            </div>
                                        </Link>
                                    </div>
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
                            <>
                                {street && (
                                    <MapContainer
                                        key={mapKey}
                                        center={[
                                            street.coordinates[0][0],
                                            street.coordinates[0][1],
                                        ]}
                                        zoom={13}
                                        style={{
                                            height: "500px",
                                            width: "100%",
                                        }}
                                        className="z-10"
                                    >
                                        <TileLayer
                                            url={tileLayers[selectedLayer]}
                                            attribution={
                                                tileLayerAttributtions[
                                                    selectedLayer
                                                ]
                                            }
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
                                                        streetCoordinates?.length ===
                                                        0,
                                                    circlemarker: false,
                                                }}
                                            />

                                            <Polyline
                                                key={street!!.id}
                                                positions={street!!.coordinates}
                                                color={"blue"}
                                            >
                                                <Popup>
                                                    <strong>
                                                        {street!!.nama_ruas ||
                                                            "Jalan Tanpa Nama"}
                                                    </strong>
                                                    <br />
                                                    <br />
                                                    {street!!.keterangan ||
                                                        "Tidak ada deskripsi"}
                                                    <br />
                                                    <br />
                                                    Panjang:{" "}
                                                    {roundToTwo(
                                                        street!!.panjang
                                                    ) || "-"}{" "}
                                                    meter
                                                    <br />
                                                    <br />
                                                    Lebar:{" "}
                                                    {street!!.lebar || "-"}{" "}
                                                    meter
                                                </Popup>
                                            </Polyline>
                                        </FeatureGroup>
                                        <TemporaryMarker />
                                    </MapContainer>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </DashboardMapLayout>
        </>
    );
}
