import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { GeocodingResponseInterface } from "@/types/types";
import { usePage } from "@inertiajs/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { toast } from "sonner";

const formSchema = z.object({
    query: z.string(),
});

interface SearchAddressProps {
    handleSelectAddress: (address: GeocodingResponseInterface) => void;
}

export default function SearchAddress({
    handleSelectAddress,
}: SearchAddressProps) {
    const { API_KEY_GEOCODING } = usePage().props;
    const [geocodingResponses, setGeocodingResponses] = useState<
        GeocodingResponseInterface[]
    >([]);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            query: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const response = await fetch(
                `https://geocode.maps.co/search?q=${values.query}&api_key=${API_KEY_GEOCODING}`,
                {
                    method: "GET",
                }
            );
            if (!response.ok) {
                throw new Error("Failed to save circle");
            }
            const data = await response.json();
            if (data.length > 0) {
                setGeocodingResponses(data as GeocodingResponseInterface[]);
                toast.success("Address found successfully!");
            } else {
                toast.success("Address not found!");
            }
        } catch (error) {
            console.error("Error fetching address:", error);
            toast.error("Address not found.");
        } finally {
            setLoading(false);
        }
    }

    console.log("SEARCH ADDRESS RENDER");

    return (
        <div className="space-y-2">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="query"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Search Address</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Search..."
                                        {...field}
                                        disabled={loading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Loading..." : "Search"}
                    </Button>
                </form>
            </Form>
            {geocodingResponses.length > 0 && (
                <div className="space-y-2">
                    <h2 className="py-2 text-sm">Address found :</h2>
                    {geocodingResponses.map((response) => (
                        <div
                            key={response.place_id}
                            className="hover:bg-green-50 shadow-md p-2 border hover:border-green-500 rounded-md text-sm hover:cursor-pointer"
                            onClick={() => {
                                handleSelectAddress(response);
                            }}
                        >
                            <h3 className="text-justify">
                                {response.display_name}
                            </h3>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
