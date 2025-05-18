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
import { useThemeStore } from "@/Store/themeStore";

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
    const { theme } = useThemeStore();
    return (
        <>
            <Card
                onClick={() => router.visit(link)}
                className="group hover:bg-gradient-to-br hover:from-yellow-200 hover:to-green-200 transition-all animate-in animate-out duration-100 hover:cursor-pointer"
            >
                <CardHeader>
                    <CardTitle className="flex justify-between items-center font-semibold">
                        <p className="group-hover:dark:text-black">{title}</p>
                        <Map
                            className="w-4 h-4"
                            color={theme == "dark" ? "white" : "black"}
                        />
                    </CardTitle>
                </CardHeader>
                <CardContent className="-mt-2">
                    <p className="font-bold group-hover:dark:text-black text-3xl">
                        {value}
                    </p>
                </CardContent>
            </Card>
        </>
    );
}
