import { AppSidebar } from "@/Components/AppSidebar";
import BreadCrumbMaps from "@/Components/BreadCrumb";
import Dropdown from "@/Components/Dropdown";
import { Separator } from "@/Components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/Components/ui/sidebar";
import { ThemeProvider } from "@/Components/ui/theme-provider";
import { usePage } from "@inertiajs/react";
import { Toaster } from "sonner";

export default function DashboardMapLayout({
    currentPath,
    children,
}: {
    currentPath: string;
    children: React.ReactNode;
}) {
    const user = usePage().props.auth.user;
    return (
        <ThemeProvider>
            <SidebarProvider>
                <AppSidebar currentPath={currentPath} />
                <SidebarInset>
                    <header className="flex items-center gap-2 border-b h-16 shrink-0">
                        <div className="z-50 flex justify-between items-center w-full">
                            <div className="flex items-center gap-2 px-3">
                                <SidebarTrigger />
                                <Separator
                                    orientation="vertical"
                                    className="mr-2 h-4"
                                />
                                <BreadCrumbMaps currentPath={currentPath} />
                            </div>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex mr-8 rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md focus:outline-none font-medium text-gray-500 hover:text-gray-700 text-sm leading-4 transition duration-150 ease-in-out"
                                        >
                                            <p className="dark:text-white">
                                                Hello, {user.name}
                                            </p>
                                            <svg
                                                className="ms-2 -me-0.5 w-4 h-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route("profile.edit")}>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </header>
                    <div className="p-8">{children}</div>
                    <Toaster />
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}
