import { memo, useState } from "react";
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet";
import { buttonOutlineCss } from "@/consts/buttonCss";
import { Search } from "lucide-react";

const formSchema = z.object({
    query: z.string(),
});

interface SearchAddressProps {
    handleSelectAddress: (address: GeocodingResponseInterface) => void;
    addressId: number;
}

export const SearchAddress = memo(
    ({ handleSelectAddress, addressId }: SearchAddressProps) => {
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
            if (values.query === "") {
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search.php?q=${values.query}&format=jsonv2`,
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
            <Sheet>
                <SheetTrigger
                    className={
                        buttonOutlineCss +
                        "my-4 bg-green-200 w-full mb-4 border-green-600 hover:bg-green-300  border"
                    }
                >
                    <Search color="black" />
                    <p className="text-black">Search Address with API</p>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Search Address</SheetTitle>
                        <SheetDescription>
                            Search the address with geocoding API
                        </SheetDescription>
                    </SheetHeader>
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
                                            {/* <FormLabel>Search Address</FormLabel> */}
                                            <FormControl>
                                                <Input
                                                    placeholder="Search..."
                                                    className="mt-4"
                                                    {...field}
                                                    disabled={loading}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? "Loading..." : "Search"}
                                </Button>
                            </form>
                        </Form>
                        {geocodingResponses.length > 0 && (
                            <div className="space-y-2 max-h-[350px] overflow-y-auto">
                                <h2 className="py-2 text-sm">
                                    Address found :
                                </h2>
                                {geocodingResponses.map((response) => (
                                    <div
                                        key={response.place_id}
                                        className={
                                            response.place_id === addressId
                                                ? `bg-green-50 shadow-md p-2 border border-green-500 rounded-md text-sm hover:cursor-pointer dark:bg-green-800`
                                                : `hover:bg-green-50 shadow-md p-2 border hover:border-green-500 rounded-md text-sm hover:cursor-pointer dark:hover:bg-green-800`
                                        }
                                        onClick={() => {
                                            handleSelectAddress(response);
                                            toast.success(
                                                "Maps centered to: " +
                                                    response.display_name
                                            );
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
                </SheetContent>
            </Sheet>
        );
    }
);
