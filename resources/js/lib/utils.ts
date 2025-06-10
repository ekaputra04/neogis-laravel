import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import SampleStreetData from "@/json/SampleStreetData.json";
import { StreetWithCoordinatesInterface } from "@/types/types";
import * as XLSX from "xlsx";

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

export function roundToTwo(num: number): string {
    const rounded = Math.round(num * 100) / 100;

    return rounded.toLocaleString("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function handleDownloadJson(streets: Object[]) {
    const jsonStr = JSON.stringify(streets, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = new Date().toISOString() + ".json";
    link.click();

    URL.revokeObjectURL(url);
}

export function handleDownloadExcel(data: StreetWithCoordinatesInterface[]) {
    const formattedData = data.map((item) => ({
        ID: item.id,
        "Nama Ruas": item.nama_ruas,
        "Kode Ruas": item.kode_ruas,
        "Panjang (m)": item.panjang,
        "Lebar (m)": item.lebar,
        "Desa ID": item.desa_id,
        "Jenis Jalan ID": item.jenisjalan_id,
        "Kondisi ID": item.kondisi_id,
        "Eksisting ID": item.eksisting_id,
        Keterangan: item.keterangan,
        "Koordinat Awal": item.coordinates[0]
            ? `${item.coordinates[0][0]}, ${item.coordinates[0][1]}`
            : "",
        "Koordinat Akhir": item.coordinates[item.coordinates.length - 1]
            ? `${item.coordinates[item.coordinates.length - 1][0]}, ${
                  item.coordinates[item.coordinates.length - 1][1]
              }`
            : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ruas Jalan");

    worksheet["!cols"] = [
        { wch: 10 },
        { wch: 30 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 10 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 30 },
        { wch: 25 },
        { wch: 25 },
    ];

    XLSX.writeFile(workbook, "ruas_jalan.xlsx");
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

export async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getContrastTextColor = (bgColor: string) => {
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance < 0.5 ? "#FFFFFF" : "#000000";
};
