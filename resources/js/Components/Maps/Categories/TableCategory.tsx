import { CategoriesInterface } from "@/types/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import EditCategoryDialog from "./EditCategoryDialog";
import DeleteCategoryDialog from "./DeletedCategoryDialog";

export default function TableCategory({
    markerCategories,
    onCategoryUpdate,
}: {
    markerCategories: CategoriesInterface[];
    onCategoryUpdate: () => void;
}) {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {markerCategories.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                Category not found
                            </TableCell>
                        </TableRow>
                    ) : (
                        markerCategories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell className="font-medium">
                                    {category.id}
                                </TableCell>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.description}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <EditCategoryDialog
                                            category={category}
                                            onCategoryUpdated={onCategoryUpdate}
                                        />
                                        <DeleteCategoryDialog
                                            categoryId={category.id}
                                            categoryName={category.name}
                                            onCategoryDeleted={onCategoryUpdate}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
