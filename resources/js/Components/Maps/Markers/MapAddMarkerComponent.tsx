import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head } from "@inertiajs/react";

export default function MapAddMarkerComponent({
    currentPath,
}: {
    currentPath: string;
}) {
    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Maps" />
                <div className="p-8 md:p-16">Aselole</div>
            </DashboardMapLayout>
        </>
    );
}
