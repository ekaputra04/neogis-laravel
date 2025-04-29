import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head, router } from "@inertiajs/react";
import {
    FeatureGroup,
    MapContainer,
    Polygon,
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
    PolygonInterface,
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

const formSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string().min(2),
    category_id: z.number(),
});

interface DrawCreatedEvent {
    layerType: string;
    layer: L.Layer;
}

interface DrawEditedEvent {
    layers: L.LayerGroup;
}

interface MapEditPolygonComponentProps {
    currentPath: string;
    polygon: PolygonInterface;
    categories: CategoriesInterface[];
}

export default function MapEditPolygonComponent({
    currentPath,
    polygon,
    categories,
}: MapEditPolygonComponentProps) {
    const [polygonCoordinates, setPolygonCoordinates] = useState<
        [number, number][]
    >(polygon.coordinates);
    const [loading, setLoading] = useState(false);
    const [mapKey, setMapKey] = useState(0);
    const [selectedCategoryName, setSelectedCategoryName] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: polygon.name,
            description: polygon.description,
            category_id: polygon.category_id,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (polygonCoordinates.length == 0) {
            toast.error("Please add a polygon first.");
            return;
        }

        const data = {
            name: values.name,
            description: values.description,
            category_id: values.category_id,
            coordinates: polygonCoordinates,
        };

        setLoading(true);

        try {
            const response = await fetch(`/api/maps/polygons/${polygon.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to update polygon");
            }

            toast.success("Polygon updated successfully!");
            form.reset();
            router.visit("/dashboard/polygon");
        } catch (error) {
            console.error("Error saving polygon:", error);
            toast.error("Error saving polygon.");
        } finally {
            setLoading(false);
        }
    }

    const handleCreated = (e: DrawCreatedEvent) => {
        const { layer } = e;

        console.log("Layer created:", layer);

        if (layer instanceof L.Polygon) {
            try {
                // Dapatkan latlngs dengan casting yang tepat
                const latLngs = layer.getLatLngs();
                console.log("Raw latLngs:", latLngs);

                // Polygon di Leaflet selalu memiliki struktur nested array
                // latLngs[0] adalah array koordinat luar, latLngs[1] dst adalah hole (jika ada)
                // Kita butuh memastikan kita mempunyai array dari objek LatLng

                // Coba pendekatan yang lebih aman dengan type guards
                let polygonPoints: L.LatLng[] = [];

                // Cek apakah latLngs adalah array 2D (polygon biasa)
                if (Array.isArray(latLngs) && latLngs.length > 0) {
                    // Ambil array koordinat luar (outer ring)
                    const outerRing = latLngs[0];

                    if (Array.isArray(outerRing)) {
                        // Iterasi melalui semua poin dalam outer ring
                        polygonPoints = outerRing as L.LatLng[];
                    }
                }

                console.log("Polygon points:", polygonPoints);

                // Transformasikan koordinat ke format yang sesuai
                const coordinates: CoordinatesInterface[] = [];

                // Sekarang kita bisa aman melakukan iterasi
                for (const point of polygonPoints) {
                    coordinates.push({
                        latitude: point.lat,
                        longitude: point.lng,
                    });
                }

                console.log("Formatted coordinates:", coordinates);

                const convertedCoordinates: [number, number][] =
                    coordinates.map((coord) => [
                        coord.latitude,
                        coord.longitude,
                    ]);

                // Simpan koordinat tersebut ke dalam state
                setPolygonCoordinates(convertedCoordinates);
            } catch (error) {
                console.error("Error processing polygon coordinates:", error);
            }
        }
    };

    const handleEdited = (e: DrawEditedEvent) => {
        console.log("Edit event:", e);

        // Variabel untuk menyimpan seluruh koordinat polygon yang diedit
        let updatedCoordinates: CoordinatesInterface[] = [];

        try {
            e.layers.eachLayer((layer: L.Layer) => {
                if (layer instanceof L.Polygon) {
                    // Ambil seluruh koordinat polygon yang diedit
                    const latLngs = layer.getLatLngs();
                    console.log("Edited latLngs:", latLngs);

                    // Sama seperti handleCreated, kita butuh memproses struktur nested
                    if (Array.isArray(latLngs) && latLngs.length > 0) {
                        const outerRing = latLngs[0];

                        if (Array.isArray(outerRing)) {
                            // Buat koordinat dari setiap point
                            const polygonPoints = outerRing as L.LatLng[];

                            // Reset updatedCoordinates untuk menghindari koordinat duplikat dari layer sebelumnya
                            updatedCoordinates = [];

                            // Proses tiap point
                            for (const point of polygonPoints) {
                                updatedCoordinates.push({
                                    latitude: point.lat,
                                    longitude: point.lng,
                                });
                            }
                        }
                    }
                }
            });

            console.log("Updated coordinates after edit:", updatedCoordinates);

            // Update state hanya jika ada koordinat yang valid
            if (updatedCoordinates.length > 0) {
                const convertedCoordinates: [number, number][] =
                    updatedCoordinates.map((coord) => [
                        coord.latitude,
                        coord.longitude,
                    ]);

                setPolygonCoordinates(convertedCoordinates);
            }
        } catch (error) {
            console.error("Error processing edited polygon:", error);
        }
    };

    const handleDeleted = (e: any) => {
        e.layers.eachLayer((layer: any) => {
            if (layer instanceof L.Polygon) {
                setPolygonCoordinates([]);
            }
        });
    };
    useEffect(() => {
        if (polygonCoordinates === null) {
            setMapKey((prevKey) => prevKey + 1);
        }
    }, [polygonCoordinates]);

    useEffect(() => {
        const initialCategory = categories.find(
            (cat) => cat.id === polygon.category_id
        );

        setSelectedCategoryName(initialCategory?.name || "");
    }, [polygon, categories]);

    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Edit Polygon" />
                <h2 className="mb-4 font-bold text-slate-900 dark:text-white text-3xl">
                    Edit Polygon
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
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Name..."
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Description
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Description"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Select
                                        required
                                        value={selectedCategoryName}
                                        onValueChange={(value) => {
                                            setSelectedCategoryName(value);

                                            const selectedCategory =
                                                categories.find(
                                                    (cat) => cat.name === value
                                                );
                                            if (selectedCategory) {
                                                form.setValue(
                                                    "category_id",
                                                    selectedCategory.id
                                                );
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    value={category.name}
                                                    key={category.id}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button type="submit">Submit</Button>
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
                                    polygon.coordinates[0][0],
                                    polygon.coordinates[0][1],
                                ]}
                                zoom={13}
                                style={{ height: "500px", width: "100%" }}
                                className="z-10"
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />

                                <FeatureGroup>
                                    <EditControl
                                        position="topright"
                                        onCreated={handleCreated}
                                        onEdited={handleEdited}
                                        onDeleted={handleDeleted}
                                        draw={{
                                            rectangle: false,
                                            polygon:
                                                polygonCoordinates?.length ===
                                                0,
                                            circle: false,
                                            marker: false,
                                            polyline: false,
                                            circlemarker: false,
                                        }}
                                    />

                                    <Polygon
                                        key={polygon.id}
                                        positions={polygon.coordinates}
                                        color={polygon.color || "blue"}
                                    >
                                        <Popup>
                                            {polygon.name ? (
                                                <strong>{polygon.name}</strong>
                                            ) : (
                                                "Garis tanpa nama"
                                            )}
                                            <br />
                                            {polygon.description ||
                                                "Tidak ada deskripsi"}
                                        </Popup>
                                    </Polygon>
                                </FeatureGroup>
                            </MapContainer>
                        )}
                    </div>
                </div>
            </DashboardMapLayout>
        </>
    );
}
