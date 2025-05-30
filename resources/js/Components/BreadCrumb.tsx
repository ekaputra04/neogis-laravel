import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { sidebarData } from "@/consts/sidebarData";
import { router } from "@inertiajs/react";
import React from "react";

export default function BreadCrumbMaps({
    currentPath,
}: {
    currentPath: string;
}) {
    const pathSegments = currentPath.split("/").filter(Boolean);

    const findBreadcrumbItems = () => {
        const breadcrumbs: { title: string; url: string }[] = [];
        let currentPath = "";

        for (const segment of pathSegments) {
            currentPath += `/${segment}`;

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
        <>
            <h1 className="md:hidden font-semibold">Neogis</h1>
            <div className="hidden md:block">
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={crumb.url}>
                                <BreadcrumbItem
                                    onClick={() => router.visit(crumb.url)}
                                    className="hover:cursor-pointer"
                                >
                                    <BreadcrumbPage>
                                        {crumb.title}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                                {index < breadcrumbs.length - 1 && (
                                    <BreadcrumbSeparator />
                                )}
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </>
    );
}
