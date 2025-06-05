import { memo, useMemo } from "react";
import { Pie, PieChart } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import { StreetWithCoordinatesInterface } from "@/types/types";
import { jenisData } from "@/Store/useStreetLegendStore";

interface JenisPieChartProps {
    streets: StreetWithCoordinatesInterface[];
}

export const JenisPieChart = memo(({ streets }: JenisPieChartProps) => {
    const chartData = useMemo(() => {
        return jenisData
            .map((item, index) => {
                const count = streets.filter(
                    (s) => s.jenisjalan_id === item.id
                ).length;
                return {
                    eksisting: item.jenisjalan,
                    streets: count,
                    fill: `hsl(var(--chart-${(index % 5) + 1}))`,
                };
            })
            .filter((item) => item.streets > 0);
    }, [streets]);

    const chartConfig = useMemo(() => {
        const config: ChartConfig = {
            streets: {
                label: "Streets",
            },
        };
        chartData.forEach((item, index) => {
            const key = item.eksisting.toLowerCase().replace(/[\s/]+/g, "_");
            config[key] = {
                label: item.eksisting,
                color: item.fill,
            };
        });
        return config;
    }, [chartData]);

    if (chartData.length === 0) {
        return (
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Jenis Data</CardTitle>
                    <CardDescription>List of Jenis Data</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-4">
                    <div className="text-muted-foreground text-center">
                        No jenis found
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Jenis Data</CardTitle>
                <CardDescription>List of Jenis Data</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="[&_.recharts-pie-label-text]:fill-foreground mx-auto pb-0.5 max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="streets"
                            nameKey="eksisting"
                            label={({ name, value }) => `${name}: ${value}`}
                            stroke="#ffffff"
                            strokeWidth={1}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="text-muted-foreground text-center leading-none">
                    Showing total street with their respective jenis
                </div>
            </CardFooter>
        </Card>
    );
});
