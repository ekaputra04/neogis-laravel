import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import SampleStreetData from "@/json/SampleStreetData.json";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function capitalizeWords(text: string): string {
    return text
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function roundToTwo(num: number): number {
    return Math.round(num * 100) / 100;
}

export function handleDownload(streets: Object[]) {
    const jsonStr = JSON.stringify(streets, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = new Date().toISOString() + ".json";
    link.click();

    URL.revokeObjectURL(url);
}

export function handleDownloadSampleStreetData() {
    const jsonStr = JSON.stringify(SampleStreetData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "sample-street-data.json";
    link.click();

    URL.revokeObjectURL(url);
}
