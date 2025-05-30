import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/Components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";
import { CategoryWithColorInterface } from "@/types/types";
import TableCategory from "../Categories/TableCategory";
import { Textarea } from "@/Components/ui/textarea";

const formSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string().min(2),
    color: z.string(),
});

export default function MapPolygonCategoriesComponent() {
    const { categories } = usePage().props;
    const [polygonCategories, setPolygonCategories] = useState<
        CategoryWithColorInterface[]
    >(categories as CategoryWithColorInterface[]);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            color: "#3388ff",
        },
    });

    const fetchData = async () => {
        setLoading(true);

        try {
            const response = await fetch(`/api/maps/polygons-categories`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch polygon categories");
            }

            const data = await response.json();
            setPolygonCategories(data);
        } catch (error) {
            console.error("Error fetching polygon categories:", error);
            toast.error("Error fetching polygon categories.");
        } finally {
            setLoading(false);
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);

        try {
            const response = await fetch(`/api/maps/polygons-categories`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error("Failed to save polygon categories");
            }

            await response.json();
            toast.success("Polygon category created successfully!");
            form.reset();
            await fetchData();
        } catch (error) {
            console.error("Error creating polygon categories:", error);
            toast.error("Error creating polygon categories.");
        } finally {
            setLoading(false);
        }
    }

    const handleCategoryUpdate = () => {
        fetchData();
    };

    return (
        <DashboardMapLayout currentPath={"/dashboard/polygon/categories"}>
            <Head title="Polygon Categories" />
            <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
                <div className="col-span-1">
                    <h2 className="mb-4 font-bold text-slate-900 dark:text-white text-3xl">
                        Polygon Category
                    </h2>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
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
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Description..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Color</FormLabel>
                                        <FormControl>
                                            <Input type="color" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={loading}>
                                {loading ? "Adding..." : "Add New Category"}
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="md:col-span-2">
                    <TableCategory
                        type="polygons"
                        categories={polygonCategories}
                        onCategoryUpdate={handleCategoryUpdate}
                    />
                </div>
            </div>
        </DashboardMapLayout>
    );
}
