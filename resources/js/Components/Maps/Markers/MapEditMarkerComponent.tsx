import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head, router } from "@inertiajs/react";
import {
    FeatureGroup,
    MapContainer,
    Marker,
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
    MarkerCoordinatesInterface,
    MarkerInterface,
} from "@/types/types";
import { toast } from "sonner";
import FormSkeleton from "@/Components/FormSkeleton";
import { Skeleton } from "@/Components/ui/skeleton";
import { customIcon } from "@/Components/CustomMarkerIcon";
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

interface MapEditMarkerComponentProps {
    currentPath: string;
    marker: MarkerInterface;
    categories: CategoriesInterface[];
}

export default function MapEditMarkerComponent({
    currentPath,
    marker,
    categories,
}: MapEditMarkerComponentProps) {
    const [markerCoordinates, setMarkerCoordinates] =
        useState<MarkerCoordinatesInterface | null>({
            latitude: marker.latitude,
            longitude: marker.longitude,
        });
    const [loading, setLoading] = useState(false);
    const [mapKey, setMapKey] = useState(0);
    const [selectedCategoryName, setSelectedCategoryName] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: marker.name,
            description: marker.description,
            category_id: marker.category_id,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!markerCoordinates) {
            toast.error("Please add a marker first.");
            return;
        }

        const data = {
            name: values.name,
            description: values.description,
            latitude: markerCoordinates.latitude,
            longitude: markerCoordinates.longitude,
            category_id: values.category_id,
        };

        setLoading(true);

        try {
            const response = await fetch(`/api/maps/markers/${marker.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to update location");
            }

            toast.success("Location updated successfully!");
            form.reset();
            router.visit("/maps/marker");
        } catch (error) {
            console.error("Error saving location:", error);
            toast.error("Error saving location.");
        } finally {
            setLoading(false);
        }
    }

    const handleCreated = (e: DrawCreatedEvent) => {
        const { layer } = e;
        if (layer instanceof L.Marker) {
            const { lat, lng } = layer.getLatLng();
            const newMarker: MarkerCoordinatesInterface = {
                latitude: lat,
                longitude: lng,
            };
            setMarkerCoordinates(newMarker);
        }
    };

    const handleEdited = (e: any) => {
        const event = e as DrawEditedEvent;

        event.layers.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                const { lat, lng } = layer.getLatLng();
                const newMarker: MarkerCoordinatesInterface = {
                    latitude: lat,
                    longitude: lng,
                };
                setMarkerCoordinates(newMarker);
            }
        });
    };

    const handleDeleted = (e: any) => {
        e.layers.eachLayer((layer: any) => {
            if (layer instanceof L.Marker) {
                setMarkerCoordinates(null);
            }
        });
    };

    useEffect(() => {
        if (markerCoordinates === null) {
            setMapKey((prevKey) => prevKey + 1);
        }
    }, [markerCoordinates]);

    useEffect(() => {
        const initialCategory = categories.find(
            (cat) => cat.id === marker.category_id
        );

        setSelectedCategoryName(initialCategory?.name || "");
    }, [marker, categories]);

    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Edit Marker" />
                <h2 className="mb-4 font-bold text-slate-900 dark:text-white text-3xl">
                    Edit Marker
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
                                center={[marker.latitude, marker.longitude]}
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
                                            polygon: false,
                                            circle: false,
                                            marker: markerCoordinates == null,
                                            polyline: false,
                                            circlemarker: false,
                                        }}
                                    />

                                    {markerCoordinates && (
                                        <Marker
                                            position={[
                                                markerCoordinates?.latitude,
                                                markerCoordinates?.longitude,
                                            ]}
                                            icon={customIcon}
                                        >
                                            <Popup>
                                                {marker.name ? (
                                                    <strong>
                                                        {marker.name}
                                                    </strong>
                                                ) : (
                                                    "Lokasi tanpa nama"
                                                )}{" "}
                                                <br />
                                                {marker.description ||
                                                    "Tidak ada deskripsi"}
                                            </Popup>
                                        </Marker>
                                    )}
                                </FeatureGroup>
                            </MapContainer>
                        )}
                    </div>
                </div>
            </DashboardMapLayout>
        </>
    );
}
