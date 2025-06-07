import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { LegendType, useStreetLegendStore } from "@/Store/useStreetLegendStore";
import EditStreetLegend from "./EditStreetLegend";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Maximize, Minimize } from "lucide-react";
import { ModeToggle } from "@/Components/ui/mode-toggle";

interface StreetLegendInterface {
    isFullScreen: boolean;
    handleMapKeyChange: () => void;
    handleIsFullScreenChange: (isFullScreen: boolean) => void;
}

export default function StreetLegend({
    isFullScreen,
    handleMapKeyChange,
    handleIsFullScreenChange,
}: StreetLegendInterface) {
    const { type, setType, eksisting, jenis, kondisi } = useStreetLegendStore();
    const [selectedType, setSelectedType] = useState<LegendType>(type);

    return (
        <div
            className={`mb-4 z-[9999] ${
                isFullScreen
                    ? "bg-white bg-opacity-75 text-black shadow-md p-4 rounded-md border"
                    : ""
            }`}
        >
            <div
                className={`${
                    isFullScreen
                        ? "mb-2 space-y-2"
                        : "flex justify-between items-center mb-4"
                }`}
            >
                <h2 className="font-semibold">Street Legend</h2>
                {isFullScreen ? (
                    <Button
                        className="bg-green-200 hover:bg-green-300 border-green-600 w-full text-black dark:text-black"
                        variant={"outline"}
                        onClick={() => handleIsFullScreenChange(false)}
                    >
                        <Minimize /> Exit Full Screen
                    </Button>
                ) : (
                    <Button
                        variant={"outline"}
                        className="bg-green-200 hover:bg-green-300 border-green-600 text-black dark:text-black"
                        onClick={() => handleIsFullScreenChange(true)}
                    >
                        <Maximize /> Full Screen
                    </Button>
                )}
            </div>
            <div
                className={`${
                    isFullScreen
                        ? "grid grid-cols-1"
                        : "gap-8 grid grid-cols-1 lg:grid-cols-3"
                }`}
            >
                <div className="space-y-2">
                    {isFullScreen ? (
                        <Select
                            onValueChange={(value) => {
                                setType(value as LegendType);
                                setSelectedType(value as LegendType);
                                handleMapKeyChange();
                            }}
                            value={
                                selectedType
                                    ? selectedType
                                    : type
                                    ? type
                                    : "eksisting"
                            }
                        >
                            <SelectTrigger className="z-[9999] w-full">
                                <SelectValue placeholder="Choice legend type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-black">
                                <SelectItem
                                    value="eksisting"
                                    className="bg-white hover:bg-gray-50"
                                >
                                    Eksisting
                                </SelectItem>
                                <SelectItem
                                    value="jenis"
                                    className="bg-white hover:bg-gray-50"
                                >
                                    Jenis
                                </SelectItem>
                                <SelectItem
                                    value="kondisi"
                                    className="bg-white hover:bg-gray-50"
                                >
                                    Kondisi
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <Select
                            onValueChange={(value) => {
                                setType(value as LegendType);
                                setSelectedType(value as LegendType);
                                handleMapKeyChange();
                            }}
                            value={
                                selectedType
                                    ? selectedType
                                    : type
                                    ? type
                                    : "eksisting"
                            }
                        >
                            <SelectTrigger className="z-50 w-full">
                                <SelectValue placeholder="Choice legend type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="eksisting">
                                    Eksisting
                                </SelectItem>
                                <SelectItem value="jenis">Jenis</SelectItem>
                                <SelectItem value="kondisi">Kondisi</SelectItem>
                            </SelectContent>
                        </Select>
                    )}

                    <EditStreetLegend handleMapKeyChange={handleMapKeyChange} />
                </div>
                <div className={`lg:col-span-2 ${isFullScreen && "mt-4"}`}>
                    {type == "eksisting" && (
                        <div
                            className={`${
                                isFullScreen
                                    ? "flex flex-col gap-1"
                                    : "flex flex-wrap gap-4 shadow-md p-4 border rounded-md"
                            }`}
                        >
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
                        <div
                            className={`${
                                isFullScreen
                                    ? "flex flex-col gap-1"
                                    : "flex flex-wrap gap-4 shadow-md p-4 border rounded-md"
                            }`}
                        >
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
                        <div
                            className={`${
                                isFullScreen
                                    ? "flex flex-col gap-1"
                                    : "flex flex-wrap gap-4 shadow-md p-4 border rounded-md"
                            }`}
                        >
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
