import { StreetWithCoordinatesInterface } from "@/types/types";
import { JenisBarChart } from "./charts/JenisBarChart";
import { KondisiBarChart } from "./charts/KondisiBarChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { EksistingBarChart } from "./charts/EksistingBarChart";
import { EksistingPieChart } from "./charts/EksistingPieChart";
import { JenisPieChart } from "./charts/JenisPieChart";
import { KondisiPieChart } from "./charts/KondisiPieChart";

interface ChartViewProps {
    streets: StreetWithCoordinatesInterface[];
}

export default function ChartView({ streets }: ChartViewProps) {
    return (
        <div className="">
            <Tabs defaultValue="bar" className="w-full">
                <TabsList>
                    <TabsTrigger value="pie">Pie Chart</TabsTrigger>
                    <TabsTrigger value="bar">Bar Chart</TabsTrigger>
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
            </Tabs>
        </div>
    );
}
