import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head } from "@inertiajs/react";
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
import { MarkerCoordinatesInterface } from "@/types/types";
import { toast } from "sonner";
import FormSkeleton from "@/Components/FormSkeleton";
import { Skeleton } from "@/Components/ui/skeleton";

const formSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string().min(2),
});

interface DrawCreatedEvent {
    layerType: string;
    layer: L.Layer;
}

interface DrawEditedEvent {
    layers: L.LayerGroup;
}

export default function MapAddMarkerComponent({
    currentPath,
}: {
    currentPath: string;
}) {
    const [marker, setMarker] = useState<MarkerCoordinatesInterface | null>(
        null
    );
    const [loading, setLoading] = useState(false);
    const [mapKey, setMapKey] = useState(0);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        console.log("MARKER", marker);
    }, [marker]);

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
        };

        console.log("DATA: " + JSON.stringify(data));

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
        console.log("Marker ditambahkan:", e);
        const { layer } = e;
        if (layer instanceof L.Marker) {
            const { lat, lng } = layer.getLatLng();
            console.log("Marker coordinates:", lat, lng);
            const newMarker: MarkerCoordinatesInterface = {
                latitude: lat,
                longitude: lng,
            };
            setMarker(newMarker);
        }
    };

    const handleEdited = (e: any) => {
        const event = e as DrawEditedEvent;
        console.log("Edited layers:", event.layers);

        event.layers.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                const { lat, lng } = layer.getLatLng();
                console.log("Marker coordinates:", lat, lng);
                const newMarker: MarkerCoordinatesInterface = {
                    latitude: lat,
                    longitude: lng,
                };
                setMarker(newMarker);
            }
        });
    };

    const handleDeleted = (e: any) => {
        console.log("Deleted layers:", e.layers);

        e.layers.eachLayer((layer: any) => {
            if (layer instanceof L.Marker) {
                console.log("Deleted marker:", layer.getLatLng());
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
                <h2 className="mb-4 font-bold text-slate-900 text-3xl">
                    Add Marker
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
                                center={[-8.65, 115.21]}
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
