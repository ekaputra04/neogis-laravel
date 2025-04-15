import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import DashboardMapLayout from "@/Layouts/DashboardMapLayout";

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const currentPath = "/profile";
    return (
        <DashboardMapLayout currentPath={currentPath as string}>
            <Head title="Profile" />

            <div className="space-y-6 mx-auto">
                <div className="shadow p-4 sm:p-8 sm:rounded-lg">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </div>

                <div className="shadow p-4 sm:p-8 sm:rounded-lg">
                    <UpdatePasswordForm />
                </div>

                <div className="shadow p-4 sm:p-8 sm:rounded-lg">
                    <DeleteUserForm />
                </div>
            </div>
        </DashboardMapLayout>
    );
}
