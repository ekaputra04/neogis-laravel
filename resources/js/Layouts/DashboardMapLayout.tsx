import { AppSidebar } from "@/Components/AppSidebar";
import BreadCrumbMaps from "@/Components/BreadCrumb";
import { Separator } from "@/Components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/Components/ui/sidebar";
import { Toaster } from "sonner";

export default function DashboardMapLayout({
    currentPath,
    children,
}: {
    currentPath: string;
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar currentPath={currentPath} />
            <SidebarInset>
                <header className="flex items-center gap-2 border-b h-16 shrink-0">
                    <div className="flex items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <BreadCrumbMaps currentPath={currentPath} />
                    </div>
                </header>
                <div className="p-8">{children}</div>
                <Toaster />
            </SidebarInset>
        </SidebarProvider>
    );
}
