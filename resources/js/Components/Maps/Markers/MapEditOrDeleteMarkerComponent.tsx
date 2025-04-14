import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head } from "@inertiajs/react";

export default function MapEditOrDeleteMarkerComponent({
    currentPath,
}: {
    currentPath: string;
}) {
    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Maps" />
                <div className="p-8 md:p-16">EditOrDelete Marker</div>
            </DashboardMapLayout>
        </>
    );
}
