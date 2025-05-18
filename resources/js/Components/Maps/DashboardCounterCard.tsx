import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { router } from "@inertiajs/react";
import { Map } from "lucide-react";

interface DashboardCounterCardProps {
    title: string;
    value: number;
    link: string;
}

export default function DashboardCounterCard({
    title,
    value,
    link,
}: DashboardCounterCardProps) {
    return (
        <>
            <Card
                onClick={() => router.visit(link)}
                className="hover:bg-gradient-to-br hover:from-yellow-200 hover:to-green-200 transition-all animate-in animate-out duration-100 hover:cursor-pointer"
            >
                <CardHeader>
                    <CardTitle className="flex justify-between items-center font-semibold">
                        <p>{title}</p>
                        <Map className="w-4 h-4" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="-mt-2">
                    <p className="font-bold text-3xl">{value}</p>
                </CardContent>
            </Card>
        </>
    );
}
