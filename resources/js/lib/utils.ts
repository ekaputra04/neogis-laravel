import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import SampleStreetData from "@/json/SampleStreetData.json";
import { StreetWithCoordinatesInterface } from "@/types/types";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { toast } from "sonner";

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
    if (streets.length == 0) {
        toast.error("No data found.");
        return;
    }

    const jsonStr = JSON.stringify(streets, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "streets-data - " + new Date().toISOString() + ".json";
    link.click();

    URL.revokeObjectURL(url);
}

export function handleDownloadExcel(data: StreetWithCoordinatesInterface[]) {
    if (data.length == 0) {
        toast.error("No data found.");
        return;
    }

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

    XLSX.writeFile(
        workbook,
        "streets-data - " + new Date().toISOString() + ".xlsx"
    );
}

export function handleDownloadPdf(data: StreetWithCoordinatesInterface[]) {
    if (data.length == 0) {
        toast.error("No data found.");
        return;
    }

    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(18);
    doc.text("Laporan Data Ruas Jalan", 14, 22);

    doc.setFontSize(12);
    doc.text(
        `Tanggal: ${new Date().toLocaleString("id-ID", {
            timeZone: "Asia/Makassar",
        })}`,
        14,
        30
    );

    const tableData = data.map((item) => [
        item.id.toString(),
        item.nama_ruas,
        item.kode_ruas,
        roundToTwo(item.panjang),
        roundToTwo(item.lebar),
        item.desa_id.toString(),
        item.jenisjalan_id.toString(),
        item.kondisi_id.toString(),
        item.eksisting_id.toString(),
        item.keterangan,
        item.coordinates[0]
            ? `${item.coordinates[0][0]}, ${item.coordinates[0][1]}`
            : "",
        item.coordinates[item.coordinates.length - 1]
            ? `${item.coordinates[item.coordinates.length - 1][0]}, ${
                  item.coordinates[item.coordinates.length - 1][1]
              }`
            : "",
    ]);

    const headers = [
        "ID",
        "Nama Ruas",
        "Kode Ruas",
        "Panjang (m)",
        "Lebar (m)",
        "Desa ID",
        "Jenis Jalan ID",
        "Kondisi ID",
        "Eksisting ID",
        "Keterangan",
        "Koordinat Awal",
        "Koordinat Akhir",
    ];

    autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 40,
        styles: { cellPadding: 3, fontSize: 10 },
        headStyles: { fillColor: "#28a745", textColor: "#ffffff" },
        alternateRowStyles: { fillColor: "#f5f5f5" },
        margin: { top: 30, left: 10, right: 10 },
    });

    doc.save("streets-data - " + new Date().toISOString() + ".pdf");
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
