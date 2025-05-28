import * as React from "react";
import { EarthIcon } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/Components/ui/sidebar";

import { sidebarData } from "@/consts/sidebarData";
import { Link, router } from "@inertiajs/react";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    currentPath: string;
}

export function AppSidebar({ currentPath, ...props }: AppSidebarProps) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="flex justify-center items-center bg-sidebar-primary rounded-lg size-8 aspect-square text-sidebar-primary-foreground">
                                    <EarthIcon className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">
                                        NeoGIS
                                    </span>
                                    <span className="">v3.1.0</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="z-50 pb-16">
                <SidebarGroup>
                    <SidebarMenu>
                        {sidebarData.navMain.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link href={item.url} className="font-medium">
                                        {item.title}
                                    </Link>
                                </SidebarMenuButton>
                                {item.items?.length ? (
                                    <SidebarMenuSub>
                                        {item.items.map((subItem) => {
                                            const isActive =
                                                currentPath === subItem.url; // Cek apakah URL saat ini cocok

                                            return (
                                                <SidebarMenuSubItem
                                                    key={subItem.title}
                                                    onClick={
                                                        () =>
                                                            router.visit(subItem.url)
                                                    }
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isActive}
                                                        className="hover:cursor-pointer"

                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {subItem.icon &&
                                                                subItem.icon}
                                                            {subItem.title}
                                                        </div>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            );
                                        })}
                                    </SidebarMenuSub>
                                ) : null}
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
