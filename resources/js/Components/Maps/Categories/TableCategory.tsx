import { CategoriesInterface, LineCategoryInterface } from "@/types/types";
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

interface TableCategoryProps {
    type: "markers" | "lines" | "polygons" | "rectangles" | "circles";
    categories: CategoriesInterface[] | LineCategoryInterface[];
    onCategoryUpdate: () => void;
}

export default function TableCategory({
    type,
    categories,
    onCategoryUpdate,
}: TableCategoryProps) {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        {type === "lines" && <TableHead>Color</TableHead>}
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                Category not found
                            </TableCell>
                        </TableRow>
                    ) : (
                        categories.map((category, index) => (
                            <TableRow key={category.id}>
                                <TableCell className="font-medium">
                                    {index + 1}
                                </TableCell>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.description}</TableCell>
                                {type == "lines" &&
                                    "color" in category &&
                                    category.color && (
                                        <TableCell>
                                            <div
                                                className="border border-black rounded-full w-6 h-6"
                                                style={{
                                                    backgroundColor:
                                                        category.color,
                                                }}
                                            ></div>
                                        </TableCell>
                                    )}
                                <TableCell>
                                    <div className="flex gap-2">
                                        <EditCategoryDialog
                                            type={type}
                                            category={category}
                                            onCategoryUpdated={onCategoryUpdate}
                                        />
                                        <DeleteCategoryDialog
                                            type={type}
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
