import { StreetWithCoordinatesInterface } from "@/types/types";
import { JenisBarChart } from "./charts/JenisBarChart";
import { KondisiBarChart } from "./charts/KondisiBarChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { EksistingBarChart } from "./charts/EksistingBarChart";
import { EksistingPieChart } from "./charts/EksistingPieChart";
import { JenisPieChart } from "./charts/JenisPieChart";
import { KondisiPieChart } from "./charts/KondisiPieChart";
import { TableStreetFilterCounter } from "./TableStreetFilterCounter";
import DashboardCounterCard from "../../DashboardCounterCard";
import { roundToTwo } from "@/lib/utils";
import { useMemo } from "react";

interface ChartViewProps {
    streets: StreetWithCoordinatesInterface[];
}

export default function ChartView({ streets }: ChartViewProps) {
    const totalLength = useMemo(() => {
        return streets.reduce((acc, street) => {
            return acc + street.panjang;
        }, 0);
    }, []);
    return (
        <div className="">
            <Tabs defaultValue="pie" className="w-full">
                <TabsList className="mb-2">
                    <TabsTrigger value="pie">Pie Chart</TabsTrigger>
                    <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                    <TabsTrigger value="length">Street Length</TabsTrigger>
                </TabsList>
                <TabsContent value="pie">
                    <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
                        <EksistingPieChart streets={streets} />
                        <JenisPieChart streets={streets} />
                    </div>
                    <div className="mt-4">
                        <KondisiPieChart streets={streets} />
                    </div>
                </TabsContent>
                <TabsContent value="bar">
                    <div>
                        <EksistingBarChart streets={streets} />
                        <div className="gap-4 grid grid-cols-1 lg:grid-cols-2 mt-4">
                            <JenisBarChart streets={streets} />
                            <KondisiBarChart streets={streets} />
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="length">
                    <div className="space-y-4">
                        <div className="gap-4 grid md:grid-cols-2">
                            <DashboardCounterCard
                                title="Total Streets"
                                value={streets.length}
                            />
                            <DashboardCounterCard
                                title="Total Length (m)"
                                value={roundToTwo(totalLength)}
                            />
                        </div>

                        <TableStreetFilterCounter
                            streets={streets}
                            title="Eksisting"
                        />
                        <TableStreetFilterCounter
                            streets={streets}
                            title="Jenis"
                        />
                        <TableStreetFilterCounter
                            streets={streets}
                            title="Kondisi"
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
