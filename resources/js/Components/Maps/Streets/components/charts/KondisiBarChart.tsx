import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

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
import { useMemo } from "react";
import { jenisData, kondisiData } from "@/Store/useStreetLegendStore";

export const description = "A bar chart with a label";

const chartConfig = {
    street: {
        label: "street",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

interface KondisiBarChartProps {
    streets: StreetWithCoordinatesInterface[];
}

export function KondisiBarChart({ streets }: KondisiBarChartProps) {
    const chartData = useMemo(() => {
        const sourceData = kondisiData;

        return (sourceData as any[]).map((item) => {
            const filterKey = "kondisi_id";

            const count = streets.filter(
                (s) => s[filterKey] === item.id
            ).length;

            return {
                id: item.id,
                eksisting: item.kondisi,
                street: count,
            };
        });
    }, [streets]);

    return (
        <div className="">
            <Card>
                <CardHeader>
                    <CardTitle>Kondisi Data</CardTitle>
                    <CardDescription>List of Kondisi Data</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                top: 20,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="eksisting"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar
                                dataKey="street"
                                fill="hsl(var(--chart-1))"
                                radius={8}
                            >
                                <LabelList
                                    position="top"
                                    offset={12}
                                    className="fill-foreground"
                                    fontSize={12}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="text-muted-foreground leading-none">
                        Showing total street with their respective kondisi
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
