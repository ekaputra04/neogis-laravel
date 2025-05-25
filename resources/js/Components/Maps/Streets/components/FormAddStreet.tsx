import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
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
import FormSkeleton from "@/Components/FormSkeleton";
import { Label } from "@/Components/ui/label";
import { capitalizeWords, roundToTwo } from "@/lib/utils";
import {
    CoordinatesInterface,
    DesaInterface,
    EksistingJalanInterface,
    JenisJalanInterface,
    KabupatenInterface,
    KecamatanInterface,
    KondisiJalanInterface,
    ProvinsiInterface,
} from "@/types/types";
import { router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { encode } from "@mapbox/polyline";
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

interface FormAddStreetProps {
    streetCoordinates: CoordinatesInterface[];
    setStreetCoordinates: (coordinates: CoordinatesInterface[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export default function FormAddStreet({
    streetCoordinates,
    setStreetCoordinates,
    loading,
    setLoading,
}: FormAddStreetProps) {
    const {
        provinsi,
        kabupaten,
        kecamatan,
        desa,
        eksisting,
        jenis,
        kondisi,
        token,
    } = usePage().props;
    const [filteredKabupaten, setFilteredKabupaten] = useState<
        KabupatenInterface[]
    >([]);
    const [filteredKecamatan, setFilteredKecamatan] = useState<
        KecamatanInterface[]
    >([]);
    const [filteredDesa, setFilteredDesa] = useState<DesaInterface[]>([]);
    const [streetLength, setStreetLength] = useState<number>();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nama_ruas: "",
            keterangan: "",
            lebar: undefined,
            desa_id: undefined,
            eksisting_id: undefined,
            jenisjalan_id: undefined,
            kode_ruas: "",
            kondisi_id: undefined,
            panjang: undefined,
        },
    });

    const namaRuas = useWatch({ control: form.control, name: "nama_ruas" });

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

    useEffect(() => {
        if (namaRuas) {
            const formatted = namaRuas
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9\-]/g, "");

            form.setValue("kode_ruas", formatted);
        }
    }, [namaRuas, form]);

    useEffect(() => {
        const formattedCoordinates: [number, number][] =
            streetCoordinates.map((coord): [number, number] => [
                coord.latitude,
                coord.longitude,
            ]) ?? [];
        if (formattedCoordinates.length > 2) {
            const line = lineString(formattedCoordinates);
            const distanceInMeter = length(line, { units: "meters" });
            form.setValue("panjang", distanceInMeter);
            setStreetLength(distanceInMeter);
        }
    }, [streetCoordinates]);

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
            router.visit("/dashboard/street");
        } catch (error) {
            console.error("Error saving street:", error);
            toast.error("Error saving street.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {loading ? (
                <>
                    <FormSkeleton count={11} />
                </>
            ) : (
                <>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-2"
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
                                        <FormLabel>Keterangan</FormLabel>
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
                                        value={roundToTwo(streetLength ?? 0)}
                                        disabled
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="lebar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Lebar (m)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Lebar"
                                                    // {...field}
                                                    disabled={loading}
                                                    type="number"
                                                    onChange={(e) => {
                                                        form.setValue(
                                                            "lebar",
                                                            Number(
                                                                e.target.value
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
                                        handleFilterKabupaten(Number(value));
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Provinsi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(provinsi as ProvinsiInterface[]).map(
                                            (provinsi) => (
                                                <SelectItem
                                                    value={provinsi.id.toString()}
                                                    key={provinsi.id}
                                                >
                                                    {capitalizeWords(
                                                        provinsi.provinsi
                                                    )}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Kabupaten</Label>
                                <Select
                                    onValueChange={(value) => {
                                        setFilteredKecamatan([]);
                                        setFilteredDesa([]);
                                        handleFilterKecamatan(Number(value));
                                    }}
                                    disabled={filteredKabupaten.length == 0}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue
                                            placeholder={
                                                filteredKabupaten.length > 0
                                                    ? "Kabupaten"
                                                    : "Please select provinsi first"
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredKabupaten.map((kabupaten) => (
                                            <SelectItem
                                                value={kabupaten.id.toString()}
                                                key={kabupaten.id}
                                            >
                                                {capitalizeWords(
                                                    kabupaten.kabupaten
                                                )}
                                            </SelectItem>
                                        ))}
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
                                    disabled={filteredKecamatan.length == 0}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue
                                            placeholder={
                                                filteredKecamatan.length > 0
                                                    ? "Kecamatan"
                                                    : "Please select kabupaten first"
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredKecamatan.map((kecamatan) => (
                                            <SelectItem
                                                value={kecamatan.id.toString()}
                                                key={kecamatan.id}
                                            >
                                                {capitalizeWords(
                                                    kecamatan.kecamatan
                                                )}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Desa</Label>
                                <Select
                                    onValueChange={(value) => {
                                        form.setValue("desa_id", Number(value));
                                    }}
                                    disabled={filteredDesa.length == 0}
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
                                                {capitalizeWords(desa.desa)}
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
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Jenis" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(jenis as JenisJalanInterface[]).map(
                                            (eksisting) => (
                                                <SelectItem
                                                    value={eksisting.id.toString()}
                                                    key={eksisting.id}
                                                >
                                                    {eksisting.jenisjalan}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button type="submit" disabled={loading}>
                                {loading ? "Adding Street..." : "Add Street"}
                            </Button>
                        </form>
                    </Form>
                </>
            )}
        </>
    );
}
