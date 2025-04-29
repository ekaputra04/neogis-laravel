import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head, Link } from "@inertiajs/react";
import { FeatureGroup, MapContainer, TileLayer } from "react-leaflet";
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
import { CategoriesInterface, CoordinatesInterface } from "@/types/types";
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
import HowToUseComponent from "@/Components/HowToUseComponent";
import { HowToUseMarkerAdd } from "@/consts/howToUse";
import { useMapLayerStore } from "@/Store/useMapLayerStore";
import { tileLayers } from "@/consts/tileLayers";

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

interface MapAddMarkerComponentProps {
    currentPath: string;
    categories: CategoriesInterface[];
}

export default function MapAddMarkerComponent({
    currentPath,
    categories,
}: MapAddMarkerComponentProps) {
    const { selectedLayer } = useMapLayerStore();
    const [marker, setMarker] = useState<CoordinatesInterface | null>(null);
    const [loading, setLoading] = useState(false);
    const [mapKey, setMapKey] = useState(0);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!marker) {
            toast.error("Please add a marker first.");
            return;
        }

        const data = {
            name: values.name,
            description: values.description,
            latitude: marker.latitude,
            longitude: marker.longitude,
            category_id: values.category_id,
        };

        setLoading(true);

        try {
            const response = await fetch(`${origin}/api/maps/markers`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to save location");
            }

            toast.success("Location saved successfully!");
            form.reset();
            setMarker(null);
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
            const newMarker: CoordinatesInterface = {
                latitude: lat,
                longitude: lng,
            };
            setMarker(newMarker);
        }
    };

    const handleEdited = (e: any) => {
        const event = e as DrawEditedEvent;

        event.layers.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                const { lat, lng } = layer.getLatLng();
                const newMarker: CoordinatesInterface = {
                    latitude: lat,
                    longitude: lng,
                };
                setMarker(newMarker);
            }
        });
    };

    const handleDeleted = (e: any) => {
        e.layers.eachLayer((layer: any) => {
            if (layer instanceof L.Marker) {
                setMarker(null);
            }
        });
    };

    useEffect(() => {
        if (marker === null) {
            setMapKey((prevKey) => prevKey + 1);
        }
    }, [marker]);

    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Add Marker" />
                <h2 className="mb-4 font-bold text-slate-900 dark:text-white text-3xl">
                    Add Marker
                </h2>
                <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
                    <div className="">
                        <HowToUseComponent tutorials={HowToUseMarkerAdd} />
                        {loading ? (
                            <>
                                <FormSkeleton count={2} />
                            </>
                        ) : (
                            <>
                                {categories.length == 0 && (
                                    <Link href={"/dashboard/marker/categories"}>
                                        <Button
                                            className="my-4"
                                            variant={"destructive"}
                                        >
                                            Please insert marker category first!
                                        </Button>
                                    </Link>
                                )}
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
                                                            disabled={
                                                                categories.length ==
                                                                0
                                                            }
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
                                                            disabled={
                                                                categories.length ==
                                                                0
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Select
                                            required
                                            onValueChange={(value) => {
                                                const selectedCategory =
                                                    categories.find(
                                                        (cat) =>
                                                            cat.name === value
                                                    );
                                                if (selectedCategory) {
                                                    form.setValue(
                                                        "category_id",
                                                        selectedCategory.id
                                                    );
                                                }
                                            }}
                                            disabled={categories.length == 0}
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
                                        <Button
                                            type="submit"
                                            disabled={categories.length == 0}
                                        >
                                            {loading
                                                ? "Adding Marker..."
                                                : "Add Marker"}
                                        </Button>
                                    </form>
                                </Form>
                            </>
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
                                center={[-8.65, 115.21]}
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
                                            marker: marker == null,
                                            polyline: false,
                                            circlemarker: false,
                                        }}
                                    />
                                </FeatureGroup>
                            </MapContainer>
                        )}
                    </div>
                </div>
            </DashboardMapLayout>
        </>
    );
}
