import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { LegendType, useStreetLegendStore } from "@/Store/useStreetLegendStore";

export default function StreetLegend() {
    const { type, setType, eksisting, jenis, kondisi } = useStreetLegendStore();
    return (
        <div className="mb-4">
            <h2 className="mb-4 font-semibold">Street Legend</h2>
            <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
                <div className="">
                    <Select
                        onValueChange={(value) => setType(value as LegendType)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choice legend type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="eksisting">Eksisting</SelectItem>
                            <SelectItem value="jenis">Jenis</SelectItem>
                            <SelectItem value="kondisi">Kondisi</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="lg:col-span-2">
                    {type == "eksisting" && (
                        <div className="flex flex-wrap gap-4 shadow-md p-4 border rounded-md">
                            {eksisting.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-2"
                                >
                                    <div
                                        className="rounded-full w-4 h-4"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm">
                                        {item.eksisting}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                    {type == "jenis" && (
                        <div className="flex flex-wrap gap-4 shadow-md p-4 border rounded-md">
                            {jenis.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-2"
                                >
                                    <div
                                        className="rounded-full w-4 h-4"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm">
                                        {item.jenisjalan}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                    {type == "kondisi" && (
                        <div className="flex flex-wrap gap-4 shadow-md p-4 border rounded-md">
                            {kondisi.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-2"
                                >
                                    <div
                                        className="rounded-full w-4 h-4"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm">
                                        {item.kondisi}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
