import { Button } from "@/Components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet";
import { Slider } from "@/Components/ui/slider";
import { buttonOutlineCss } from "@/consts/buttonCss";
import { useStreetLegendStore } from "@/Store/useStreetLegendStore";
import { Save, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function EditStreetLegend() {
    const { type, eksisting, jenis, kondisi, setColor, setWeight } =
        useStreetLegendStore();

    const [localData, setLocalData] = useState({
        eksisting: eksisting.map((item) => ({ ...item })),
        jenis: jenis.map((item) => ({ ...item })),
        kondisi: kondisi.map((item) => ({ ...item })),
    });

    const [loading, setLoading] = useState(false);

    const handleColorChange = (
        type: "eksisting" | "jenis" | "kondisi",
        id: number,
        color: string
    ) => {
        setLocalData((prev) => ({
            ...prev,
            [type]: prev[type].map((item) =>
                item.id === id ? { ...item, color } : item
            ),
        }));
    };

    const handleWeightChange = (
        type: "eksisting" | "jenis" | "kondisi",
        id: number,
        weight: number
    ) => {
        setLocalData((prev) => ({
            ...prev,
            [type]: prev[type].map((item) =>
                item.id === id ? { ...item, weight } : item
            ),
        }));
    };

    const handleSave = () => {
        setLoading(true);
        localData[type].forEach((item) => {
            setColor(type, item.id, item.color);
            setWeight(type, item.id, item.weight);
        });
        toast.success("Legend updated successfully!");
        setLoading(false);
    };

    return (
        <Sheet>
            <SheetTrigger
                className={
                    buttonOutlineCss +
                    " bg-green-200 hover:bg-green-300 text-black space-x-2 w-full"
                }
            >
                <Settings /> Setting {type} legend
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit {type} legend</SheetTitle>
                    <SheetDescription>
                        Edit the legend by fill the data bellow.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid grid-cols-4 mt-4">
                    <p className="text-sm">Item</p>
                    <p className="text-sm">Color</p>
                    <p className="col-span-2 text-sm">Weight</p>
                </div>
                <hr className="my-2" />
                <div className="space-y-4">
                    {type === "eksisting" &&
                        localData.eksisting.map((item) => (
                            <div
                                key={item.id}
                                className="items-center gap-4 grid grid-cols-4"
                            >
                                <p className="font-medium text-sm">
                                    {item.eksisting}
                                </p>
                                <input
                                    type="color"
                                    value={item.color}
                                    onChange={(e) =>
                                        handleColorChange(
                                            type,
                                            item.id,
                                            e.target.value
                                        )
                                    }
                                    className="col-span-1"
                                />
                                <Slider
                                    value={[item.weight]}
                                    min={1}
                                    max={10}
                                    step={1}
                                    onValueChange={(value) =>
                                        handleWeightChange(
                                            type,
                                            item.id,
                                            value[0]
                                        )
                                    }
                                    className="col-span-2"
                                />
                            </div>
                        ))}
                    {type === "jenis" &&
                        localData.jenis.map((item) => (
                            <div
                                key={item.id}
                                className="items-center gap-4 grid grid-cols-4"
                            >
                                <p className="font-medium text-sm">
                                    {item.jenisjalan}
                                </p>
                                <input
                                    type="color"
                                    value={item.color}
                                    onChange={(e) =>
                                        handleColorChange(
                                            type,
                                            item.id,
                                            e.target.value
                                        )
                                    }
                                    className="col-span-1"
                                />
                                <Slider
                                    value={[item.weight]}
                                    min={1}
                                    max={10}
                                    step={1}
                                    onValueChange={(value) =>
                                        handleWeightChange(
                                            type,
                                            item.id,
                                            value[0]
                                        )
                                    }
                                    className="col-span-2"
                                />
                            </div>
                        ))}
                    {type === "kondisi" &&
                        localData.kondisi.map((item) => (
                            <div
                                key={item.id}
                                className="items-center gap-4 grid grid-cols-4"
                            >
                                <p className="font-medium text-sm">
                                    {item.kondisi}
                                </p>
                                <input
                                    type="color"
                                    value={item.color}
                                    onChange={(e) =>
                                        handleColorChange(
                                            type,
                                            item.id,
                                            e.target.value
                                        )
                                    }
                                    className="col-span-1"
                                />
                                <Slider
                                    value={[item.weight]}
                                    min={1}
                                    max={10}
                                    step={1}
                                    onValueChange={(value) =>
                                        handleWeightChange(
                                            type,
                                            item.id,
                                            value[0]
                                        )
                                    }
                                    className="col-span-2"
                                />
                            </div>
                        ))}
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? (
                            "Loading..."
                        ) : (
                            <>
                                <Save className="mr-2 w-4 h-4" /> Save
                            </>
                        )}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
