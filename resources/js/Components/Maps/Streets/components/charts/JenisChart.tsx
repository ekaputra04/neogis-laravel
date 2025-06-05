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
import { jenisData } from "@/Store/useStreetLegendStore";

export const description = "A bar chart with a label";

const chartConfig = {
    street: {
        label: "street",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

interface JenisChartProps {
    streets: StreetWithCoordinatesInterface[];
}

export function JenisChart({ streets }: JenisChartProps) {
    const chartData = useMemo(() => {
        const sourceData = jenisData;

        return (sourceData as any[]).map((item) => {
            const filterKey = "jenisjalan_id";

            const count = streets.filter(
                (s) => s[filterKey] === item.id
            ).length;

            return {
                id: item.id,
                eksisting: item.jenisjalan,
                street: count,
            };
        });
    }, [streets]);

    return (
        <div className="">
            <Card>
                <CardHeader>
                    <CardTitle>Jenis Data</CardTitle>
                    <CardDescription>List of Jenis Data</CardDescription>
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
                        Showing total street with their respective jenis
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
