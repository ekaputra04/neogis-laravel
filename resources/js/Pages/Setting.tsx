import ChangeThemeComponent from "@/Components/Maps/Settings/ChangeTheme";
import MapLayerComponent from "@/Components/Maps/Settings/MapLayer";
import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head } from "@inertiajs/react";

export default function Settings() {
    return (
        <DashboardMapLayout currentPath="/dashboard/settings">
            <Head title="Profile" />

            <div className="space-y-6 mx-auto">
                <div className="shadow p-4 sm:p-8 sm:rounded-lg">
                    <MapLayerComponent />
                </div>
                <div className="shadow p-4 sm:p-8 sm:rounded-lg">
                    <ChangeThemeComponent />
                </div>
            </div>
        </DashboardMapLayout>
    );
}
