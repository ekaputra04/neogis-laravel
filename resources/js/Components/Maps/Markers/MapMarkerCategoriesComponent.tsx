import DashboardMapLayout from "@/Layouts/DashboardMapLayout";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/Components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

const formSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string().min(2),
});

export default function MapMarkerCategoriesComponent() {
    const [loading, setLoading] = useState(false);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
        setLoading(true);

        try {
            const response = await fetch(`/api/maps/markers/categories`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            console.log("RESPONSE: ", response.json());

            if (!response.ok) {
                throw new Error("Failed to save marker categories");
            }

            toast.success("Marker categories created successfully!");
            form.reset();
        } catch (error) {
            console.error("Error creating marker categories:", error);
            toast.error("Error craeating marker categories.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <DashboardMapLayout currentPath={"/maps/marker/categories"}>
            <Head title="Marker Categories" />
            <div className="gap-8 grid grid-cols-1 md:grid-cols-2">
                <div className="">
                    <h2 className="mb-4 font-bold text-slate-900 dark:text-white text-3xl">
                        Marker Category
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
                                            <Input
                                                placeholder="Description..."
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
                </div>
                <div className=""></div>
            </div>
        </DashboardMapLayout>
    );
}
