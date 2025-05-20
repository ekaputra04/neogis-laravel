import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head, router } from "@inertiajs/react";
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
import { CategoriesInterface, LineInterface } from "@/types/types";
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
import HowToUseComponent from "@/Components/HowToUseComponent";
import { HowToUseLineUpdate } from "@/consts/howToUse";

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

interface MapEditLineComponentProps {
    currentPath: string;
    line: LineInterface;
    categories: CategoriesInterface[];
}

export default function MapEditLineComponent({
    currentPath,
    line,
    categories,
}: MapEditLineComponentProps) {
    const { selectedLayer } = useMapLayerStore();
    const [lineCoordinates, setLineCoordinates] = useState<
        [number, number][] | null
    >(line.coordinates);
    const [loading, setLoading] = useState(false);
    const [mapKey, setMapKey] = useState(0);
    const [selectedCategoryName, setSelectedCategoryName] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: line.name,
            description: line.description,
            category_id: line.category_id,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!lineCoordinates) {
            toast.error("Please add a line first.");
            return;
        }

        const data = {
            name: values.name,
            description: values.description,
            category_id: values.category_id,
            coordinates: lineCoordinates,
        };

        setLoading(true);

        try {
            const response = await fetch(`/api/maps/lines/${line.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to update line");
            }

            toast.success("Line updated successfully!");
            form.reset();
            router.visit("/dashboard/line");
        } catch (error) {
            console.error("Error saving line:", error);
            toast.error("Error saving line.");
        } finally {
            setLoading(false);
        }
    }

    const handleCreated = (e: DrawCreatedEvent) => {
        const { layer } = e;

        if (layer instanceof L.Polyline) {
            const latLngs = layer.getLatLngs() as L.LatLng[];

            const coordinates: [number, number][] = latLngs.map((latLng) => [
                latLng.lat,
                latLng.lng,
            ]);

            setLineCoordinates(coordinates);
        }
    };

    const handleEdited = (e: DrawEditedEvent) => {
        const event = e as DrawEditedEvent;

        let updatedCoordinates: [number, number][] = [];

        event.layers.eachLayer((layer) => {
            if (layer instanceof L.Polyline) {
                const latLngs = layer.getLatLngs() as L.LatLng[];

                updatedCoordinates = latLngs.map((latLng) => [
                    latLng.lat,
                    latLng.lng,
                ]);
            }
        });

        setLineCoordinates(updatedCoordinates);
    };

    const handleDeleted = (e: any) => {
        e.layers.eachLayer((layer: any) => {
            if (layer instanceof L.Polyline) {
            }
        });
    };

    useEffect(() => {
        if (lineCoordinates === null) {
            setMapKey((prevKey) => prevKey + 1);
        }
    }, [lineCoordinates]);

    useEffect(() => {
        const initialCategory = categories.find(
            (cat) => cat.id === line.category_id
        );

        setSelectedCategoryName(initialCategory?.name || "");
    }, [line, categories]);

    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Edit Line" />
                <h2 className="mb-4 font-bold text-slate-900 dark:text-white text-3xl">
                    Edit Line
                </h2>
                <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
                    <div className="">
                        <HowToUseComponent tutorials={HowToUseLineUpdate} />
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
                                    line.coordinates[0][0],
                                    line.coordinates[0][1],
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
                                                lineCoordinates?.length === 0,
                                            circlemarker: false,
                                        }}
                                    />

                                    <Polyline
                                        key={line.id}
                                        positions={line.coordinates}
                                        color={line.color || "blue"}
                                    >
                                        <Popup>
                                            {line.name ? (
                                                <strong>{line.name}</strong>
                                            ) : (
                                                "Garis tanpa nama"
                                            )}
                                            <br />
                                            {line.description ||
                                                "Tidak ada deskripsi"}
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
