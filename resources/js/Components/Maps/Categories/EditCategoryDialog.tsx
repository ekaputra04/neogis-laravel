import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CategoriesInterface, CategoryWithColorInterface } from "@/types/types";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/Components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Pencil } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string().min(2),
    color: z.string().optional(), // color tetap opsional
});

interface EditCategoryDialogProps {
    type: "markers" | "lines" | "polygons" | "rectangles" | "circles";
    category: CategoriesInterface | CategoryWithColorInterface;
    onCategoryUpdated: () => void;
}

export default function EditCategoryDialog({
    type,
    category,
    onCategoryUpdated,
}: EditCategoryDialogProps) {
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: category.name,
            description: category.description,
            color:
                "color" in category ? category.color ?? "#000000" : undefined, // Aman!
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);

        try {
            const payload = {
                name: values.name,
                description: values.description,
                ...(type != "markers" && values.color
                    ? { color: values.color }
                    : {}),
            };

            const response = await fetch(
                `/api/maps/${type}-categories/${category.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to update ${type} category`);
            }

            toast.success(
                `${capitalizeFirstLetter(type)} category updated successfully!`
            );
            setIsOpen(false);
            onCategoryUpdated();
        } catch (error) {
            console.error(`Error updating ${type} category:`, error);
            toast.error(`Error updating ${type} category.`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="inline-flex justify-center items-center gap-2 bg-background hover:bg-accent disabled:opacity-50 shadow-sm px-3 py-1 border border-input rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&_svg]:size-4 font-medium text-sm whitespace-nowrap transition-colors hover:text-accent-foreground [&_svg]:pointer-events-none disabled:pointer-events-none [&_svg]:shrink-0">
                <Pencil /> Edit
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogDescription>
                        Update the details for the category: {category.name}
                    </DialogDescription>
                </DialogHeader>

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
                        {type != "markers" && (
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
                        )}
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
