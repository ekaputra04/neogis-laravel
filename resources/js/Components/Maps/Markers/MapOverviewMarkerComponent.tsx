import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head } from "@inertiajs/react";

export default function MapOverviewMarkerComponent({
    currentPath,
}: {
    currentPath: string;
}) {
    return (
        <>
            <DashboardMapLayout currentPath={currentPath as string}>
                <Head title="Maps" />
                <div>Overview Marker</div>
            </DashboardMapLayout>
        </>
    );
}
