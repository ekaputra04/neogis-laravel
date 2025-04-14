import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { sidebarData } from "@/consts/sidebarData";
import React from "react";

export default function BreadCrumbMaps({
    currentPath,
}: {
    currentPath: string;
}) {
    const pathSegments = currentPath.split("/").filter(Boolean); // Menghapus string kosong dari split

    // Fungsi untuk menemukan item sidebar berdasarkan path
    const findBreadcrumbItems = () => {
        const breadcrumbs: { title: string; url: string }[] = [];
        let currentPath = "";

        for (const segment of pathSegments) {
            currentPath += `/${segment}`;

            // Cari dalam data sidebar
            let foundItem = null;

            for (const category of sidebarData.navMain) {
                if (category.url === currentPath) {
                    foundItem = { title: category.title, url: category.url };
                    break;
                }
                for (const item of category.items) {
                    if (item.url === currentPath) {
                        foundItem = { title: item.title, url: item.url };
                        break;
                    }
                }
            }

            if (foundItem) {
                breadcrumbs.push(foundItem);
            }
        }

        return breadcrumbs;
    };

    const breadcrumbs = findBreadcrumbItems();

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.url}>
                        <BreadcrumbItem>
                            {index === breadcrumbs.length - 1 ? (
                                <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink href={crumb.url}>
                                    {crumb.title}
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && (
                            <BreadcrumbSeparator />
                        )}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
