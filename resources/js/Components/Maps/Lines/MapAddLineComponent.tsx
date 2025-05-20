import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head, Link, router } from "@inertiajs/react";
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
import { useCallback, useEffect, useState } from "react";
import {
    CategoriesInterface,
    CoordinatesInterface,
    GeocodingResponseInterface,
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
import HowToUse from "@/Components/HowToUseComponent";
import { HowToUseLineAdd, HowToUseMarkerAdd } from "@/consts/howToUse";
import { SearchAddress } from "@/Components/SearchAddress";
import { centerPoints } from "@/consts/centerPoints";
import { MapCenterLayerUpdater } from "@/Components/MapCenterUpdater";

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

interface MapAddLineComponentProps {
    currentPath: string;
    categories: CategoriesInterface[];
}

export default function MapAddLineComponent({
    currentPath,
    categories,
}: MapAddLineComponentProps) {
    const [lineCoordinates, setLineCoordinates] = useState<
        CoordinatesInterface[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [mapKey, setMapKey] = useState(0);
    const [address, setAddress] = useState<GeocodingResponseInterface>();
    const [mapCenter, setMapCenter] = useState<CoordinatesInterface>({
        latitude: centerPoints[0],
        longitude: centerPoints[1],
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!lineCoordinates) {
            toast.error("Please add a line first.");
            return;
        }

        const formattedCoordinates = lineCoordinates.map((coord) => [
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
            const response = await fetch(`${origin}/api/maps/lines`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to save line");
            }

            toast.success("Line saved successfully!");
            form.reset();
            setLineCoordinates([]);
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

            const coordinates: CoordinatesInterface[] = latLngs.map(
                (latLng) => ({
                    latitude: latLng.lat,
                    longitude: latLng.lng,
                })
            );

            setLineCoordinates(coordinates);
        }
    };

    const handleEdited = (e: DrawEditedEvent) => {
        const event = e as DrawEditedEvent;

        let updatedCoordinates: CoordinatesInterface[] = [];

        event.layers.eachLayer((layer) => {
            if (layer instanceof L.Polyline) {
                const latLngs = layer.getLatLngs() as L.LatLng[];

                updatedCoordinates = latLngs.map((latLng) => ({
                    latitude: latLng.lat,
                    longitude: latLng.lng,
                }));
            }
        });

        setLineCoordinates(updatedCoordinates);
    };

    const handleDeleted = (e: any) => {
        e.layers.eachLayer((layer: any) => {
            if (layer instanceof L.Polyline) {
                setLineCoordinates([]);
            }
        });
    };

    const handleSelectAddress = useCallback(
        (address: GeocodingResponseInterface) => {
            setAddress(address);
        },
        []
    );

    const handleSetMapCenter = (center: CoordinatesInterface) => {
        setMapCenter(center);
    };

    useEffect(() => {
        if (address) {
            handleSetMapCenter({
                latitude: Number((address as GeocodingResponseInterface).lat),
                longitude: Number((address as GeocodingResponseInterface)?.lon),
            });
        }
    }, [address]);

    useEffect(() => {
        if (lineCoordinates.length == 0) {
            setMapKey((prevKey) => prevKey + 1);
        }
    }, [lineCoordinates]);

    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Add Line" />
                <h2 className="mb-4 font-bold text-slate-900 dark:text-white text-3xl">
                    Add Line
                </h2>
                <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
                    <div className="">
                        <SearchAddress
                            handleSelectAddress={handleSelectAddress}
                            addressId={address?.place_id || 0}
                        />
                        <HowToUse tutorials={HowToUseLineAdd} />

                        {loading ? (
                            <>
                                <FormSkeleton count={2} />
                            </>
                        ) : (
                            <>
                                {categories.length == 0 && (
                                    <Link href={"/dashboard/line/categories"}>
                                        <Button
                                            className="my-4"
                                            variant={"destructive"}
                                        >
                                            Please insert line category first!
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
                                                ? "Adding Line..."
                                                : "Add Line"}
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
                                center={[centerPoints[0], centerPoints[1]]}
                                zoom={13}
                                style={{ height: "500px", width: "100%" }}
                                className="z-10"
                            >
                                <MapCenterLayerUpdater
                                    address={address!!}
                                    mapCenter={mapCenter}
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
                                                lineCoordinates?.length == 0,
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
