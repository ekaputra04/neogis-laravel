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
import HowToUse from "@/Components/HowToUseComponent";
import { HowToUseMarkerAdd } from "@/consts/howToUse";
import { useMapLayerStore } from "@/Store/useMapLayerStore";
import { tileLayerAttributtions, tileLayers } from "@/consts/tileLayers";
import { TemporaryMarker } from "@/Components/TemporaryMarker";

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

interface MapAddRectangleComponentProps {
    currentPath: string;
    categories: CategoriesInterface[];
}

export default function MapAddRectangleComponent({
    currentPath,
    categories,
}: MapAddRectangleComponentProps) {
    const { selectedLayer } = useMapLayerStore();
    const [rectangleCoordinates, setRectangleCoordinates] = useState<
        CoordinatesInterface[] | null
    >([]);
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
        if (!rectangleCoordinates) {
            toast.error("Please add a rectangle first.");
            return;
        }

        const formattedCoordinates = rectangleCoordinates.map((coord) => [
            coord.latitude,
            coord.longitude,
        ]);

        const data = {
            name: values.name,
            description: values.description,
            category_id: values.category_id,
            coordinates: formattedCoordinates,
        };

        setLoading(true);

        try {
            const response = await fetch(`/api/maps/rectangles`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to save rectangle");
            }

            toast.success("Rectangle saved successfully!");
            form.reset();
            setRectangleCoordinates(null);
        } catch (error) {
            console.error("Error saving rectangle:", error);
            toast.error("Error saving rectangle.");
        } finally {
            setLoading(false);
        }
    }

    const handleCreated = (e: DrawCreatedEvent) => {
        // const { layer } = e;
        // if (layer instanceof L.Rectangle) {
        //     // Ambil seluruh koordinat polyline
        //     const latLngs = layer.getLatLngs() as L.LatLng[];
        //     // Transformasikan koordinat ke format yang sesuai
        //     const coordinates: CoordinatesInterface[] = latLngs.map(
        //         (latLng) => ({
        //             latitude: latLng.lat,
        //             longitude: latLng.lng,
        //         })
        //     );
        //     console.log(coordinates);
        //     // Simpan koordinat tersebut ke dalam state (atau tempat lain yang sesuai)
        //     setRectangleCoordinates(coordinates);
        // }
    };

    const handleEdited = (e: DrawEditedEvent) => {
        const event = e as DrawEditedEvent;

        // Variabel untuk menyimpan seluruh koordinat polyline yang diedit
        let updatedCoordinates: CoordinatesInterface[] = [];

        event.layers.eachLayer((layer) => {
            if (layer instanceof L.Polyline) {
                // Ambil seluruh koordinat polyline yang diedit
                const latLngs = layer.getLatLngs() as L.LatLng[];

                // Map koordinat ke format yang sesuai
                updatedCoordinates = latLngs.map((latLng) => ({
                    latitude: latLng.lat,
                    longitude: latLng.lng,
                }));
            }
        });

        // Update state dengan koordinat yang telah diedit
        setRectangleCoordinates(updatedCoordinates);
    };

    const handleDeleted = (e: any) => {
        e.layers.eachLayer((layer: any) => {
            if (layer instanceof L.Marker) {
                setRectangleCoordinates(null);
            }
        });
    };

    useEffect(() => {
        if (rectangleCoordinates === null) {
            setMapKey((prevKey) => prevKey + 1);
        }

        console.log(
            "rectangleCoordinates",
            JSON.stringify(rectangleCoordinates)
        );
    }, [rectangleCoordinates]);

    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Add Rectangle" />
                <h2 className="mb-4 font-bold text-slate-900 dark:text-white text-3xl">
                    Add Rectangle
                </h2>
                <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
                    <div className="">
                        <HowToUse tutorials={HowToUseMarkerAdd} />

                        {loading ? (
                            <>
                                <FormSkeleton count={2} />
                            </>
                        ) : (
                            <>
                                {categories.length == 0 && (
                                    <Link
                                        href={"/dashboard/rectangle/categories"}
                                    >
                                        <Button
                                            className="my-4"
                                            variant={"destructive"}
                                        >
                                            Please insert rectangle category
                                            first!
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
                                                ? "Adding Rectangle..."
                                                : "Add Rectangle"}
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
                                <TileLayer
                                    url={tileLayers[selectedLayer]}
                                    attribution={
                                        tileLayerAttributtions[selectedLayer]
                                    }
                                />

                                <FeatureGroup>
                                    <EditControl
                                        position="topright"
                                        // onCreated={handleCreated}
                                        // onEdited={handleEdited}
                                        // onDeleted={handleDeleted}
                                        // draw={{
                                        //     rectangle:
                                        //         rectangleCoordinates?.length ==
                                        //         0,
                                        //     polygon: false,
                                        //     circle: false,
                                        //     marker: false,
                                        //     polyline: false,
                                        //     circlemarker: false,
                                        // }}
                                        draw={{
                                            rectangle: true,
                                            polygon: true,
                                            circle: true,
                                            marker: false,
                                            polyline: false,
                                            circlemarker: false,
                                        }}
                                    />
                                </FeatureGroup>
                                <TemporaryMarker />
                            </MapContainer>
                        )}
                    </div>
                </div>
            </DashboardMapLayout>
        </>
    );
}
