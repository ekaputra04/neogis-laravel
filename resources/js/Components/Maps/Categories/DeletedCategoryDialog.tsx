import { useState } from "react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";

interface DeleteCategoryDialogProps {
    categoryId: number;
    categoryName: string;
    onCategoryDeleted: () => void;
}

export default function DeleteCategoryDialog({
    categoryId,
    categoryName,
    onCategoryDeleted,
}: DeleteCategoryDialogProps) {
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                `/api/maps/markers-categories/${categoryId}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete marker category");
            }

            toast.success("Marker category deleted successfully!");
            setIsOpen(false);
            onCategoryDeleted();
        } catch (error) {
            console.error("Error deleting marker category:", error);
            toast.error("Error deleting marker category.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger className="inline-flex justify-center items-center gap-2 bg-destructive hover:bg-destructive/90 disabled:opacity-50 shadow-sm px-3 py-1 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&_svg]:size-4 font-medium text-destructive-foreground text-sm whitespace-nowrap transition-colors [&_svg]:pointer-events-none disabled:pointer-events-none [&_svg]:shrink-0">
                Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to delete?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the category "
                        {categoryName}" and cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
