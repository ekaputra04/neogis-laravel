import { StreetWithCoordinatesInterface } from "@/types/types";
import { EksistingChart } from "./charts/EksistingChart";
import { JenisChart } from "./charts/JenisChart";
import { KondisiChart } from "./charts/KondisiChart";

interface ChartViewProps {
    streets: StreetWithCoordinatesInterface[];
}

export default function ChartView({ streets }: ChartViewProps) {
    return (
        <div className="">
            <EksistingChart streets={streets} />
            <div className="gap-4 grid grid-cols-1 lg:grid-cols-2 mt-4">
                <JenisChart streets={streets} />
                <KondisiChart streets={streets} />
            </div>
        </div>
    );
}
