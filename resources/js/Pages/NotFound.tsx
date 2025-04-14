import { Button } from "@/Components/ui/button";
import { Head } from "@inertiajs/react";
import NotFound from "react-notfound-page";

const CustomButton = () => (
    <Button className="mt-4" onClick={() => (window.location.href = "/")}>
        Go to Home Page
    </Button>
);

export default function NotFoundPage() {
    return (
        <>
            <Head title="Page Not Found" />
            <NotFound
                ButtonComponent={CustomButton}
                text="Page Not Found"
                textClassName="text-red-500"
                rootClassName="my-custom-class"
            />
        </>
    );
}
