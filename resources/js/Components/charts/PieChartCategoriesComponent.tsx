import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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

interface PieChartCategoriesComponentProps {
    markerCategoriesCount: number;
    lineCategoriesCount: number;
    polygonCategoriesCount: number;
    circleCategoriesCount: number;
}
export function PieChartCategoriesComponent({
    markerCategoriesCount,
    lineCategoriesCount,
    polygonCategoriesCount,
    circleCategoriesCount,
}: PieChartCategoriesComponentProps) {
    const chartData = [
        {
            spatialData: "marker",
            visitors: markerCategoriesCount,
            fill: "var(--color-marker)",
        },
        {
            spatialData: "line",
            visitors: lineCategoriesCount,
            fill: "var(--color-line)",
        },
        {
            spatialData: "polygon",
            visitors: polygonCategoriesCount,
            fill: "var(--color-polygon)",
        },
        {
            spatialData: "circle",
            visitors: circleCategoriesCount,
            fill: "var(--color-circle)",
        },
    ];

    const totalSpatialData = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
    }, []);

    const chartConfig = {
        visitors: {
            label: "Visitors",
        },
        marker: {
            label: "Marker Categories",
            color: "hsl(var(--chart-1))",
        },
        line: {
            label: "Line Categories",
            color: "hsl(var(--chart-2))",
        },
        polygon: {
            label: "Polygon Categories",
            color: "hsl(var(--chart-3))",
        },
        circle: {
            label: "Circle Categories",
            color: "hsl(var(--chart-4))",
        },
        other: {
            label: "Other",
            color: "hsl(var(--chart-5))",
        },
    } satisfies ChartConfig;

    return (
        <Card className="flex flex-col p-0">
            <CardHeader className="items-center pb-0">
                <CardTitle>Total Categories Data</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto max-h-[250px] aspect-square"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="visitors"
                            nameKey="spatialData"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (
                                        viewBox &&
                                        "cx" in viewBox &&
                                        "cy" in viewBox
                                    ) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground font-bold text-3xl"
                                                >
                                                    {totalSpatialData.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Categories Data
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                {/* <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month{" "}
                    <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing total visitors for the last 6 months
                </div> */}
            </CardFooter>
        </Card>
    );
}
