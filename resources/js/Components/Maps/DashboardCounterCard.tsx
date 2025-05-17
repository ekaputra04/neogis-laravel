import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Map } from "lucide-react";

interface DashboardCounterCardProps {
    title: string;
    value: number;
}

export default function DashboardCounterCard({
    title,
    value,
}: DashboardCounterCardProps) {
    return (
        <>
            <Card>
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
