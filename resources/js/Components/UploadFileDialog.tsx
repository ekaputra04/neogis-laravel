import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { buttonOutlineCss } from "@/consts/buttonCss";
import { Download, Upload } from "lucide-react";
import { useState } from "react";
import { FileUpload } from "./ui/file-upload";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { delay, handleDownloadSampleStreetData } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN = localStorage.getItem("external_api_token") as string;

interface UploadFileDialogProps {
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export default function UploadFileDialog({
    loading,
    setLoading,
}: UploadFileDialogProps) {
    const [files, setFiles] = useState<File[]>([]);

    const expectedKeys = [
        "paths",
        "desa_id",
        "kode_ruas",
        "nama_ruas",
        "panjang",
        "lebar",
        "eksisting_id",
        "kondisi_id",
        "jenisjalan_id",
        "keterangan",
    ];

    const isValidStreetObject = (obj: any) =>
        expectedKeys.every((key) => key in obj);

    const handleFileUpload = async (files: File[]) => {
        setFiles(files);
    };

    const handleSubmit = async () => {
        if (files.length === 0) {
            toast.error("No file selected.");
            return;
        }
        setLoading(true);

        for (const file of files) {
            try {
                const text = await file.text();
                const json = JSON.parse(text);

                // Validasi file harus array dan tiap item sesuai format
                if (
                    !Array.isArray(json) ||
                    json.length === 0 ||
                    !json.every(isValidStreetObject)
                ) {
                    toast.error(`File "${file.name}" tidak sesuai format.`);
                    continue;
                }

                for (const item of json) {
                    const formBody = new URLSearchParams();
                    formBody.append("paths", item.paths);
                    formBody.append("desa_id", item.desa_id.toString());
                    formBody.append("kode_ruas", item.kode_ruas);
                    formBody.append("nama_ruas", item.nama_ruas);
                    formBody.append("panjang", item.panjang.toString());
                    formBody.append("lebar", item.lebar.toString());
                    formBody.append(
                        "eksisting_id",
                        item.eksisting_id.toString()
                    );
                    formBody.append("kondisi_id", item.kondisi_id.toString());
                    formBody.append(
                        "jenisjalan_id",
                        item.jenisjalan_id.toString()
                    );
                    formBody.append("keterangan", item.keterangan);

                    const response = await fetch(`${API_URL}/ruasjalan`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Authorization: `Bearer ${TOKEN}`,
                        },
                        body: formBody.toString(),
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error("API error:", errorText);
                        toast.error(`Gagal upload data: ${item.nama_ruas}`);
                        continue;
                    }

                    const result = await response.json();
                    console.log("Berhasil upload:", result);
                }

                toast.success(`Berhasil upload semua data dari "${file.name}"`);
            } catch (error) {
                console.error("Error processing file:", error);
                toast.error(`Gagal membaca file "${file.name}"`);
                setLoading(false);
            }
        }

        router.visit("/dashboard/street");
    };

    return (
        <div className="">
            <AlertDialog>
                <AlertDialogTrigger
                    className={
                        buttonOutlineCss +
                        " bg-green-200 hover:bg-green-200 text-black dark:text-black"
                    }
                    disabled={loading}
                >
                    <Upload color="black" />
                    <p className="text-black">Add via file</p>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Upload file</AlertDialogTitle>
                        <AlertDialogDescription></AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="">
                        <Button
                            variant={"link"}
                            onClick={() => handleDownloadSampleStreetData()}
                        >
                            <Download /> Download Sample Street Data
                        </Button>
                    </div>
                    <div className="bg-white dark:bg-black mx-auto border border-neutral-200 dark:border-neutral-800 border-dashed rounded-lg w-full max-w-4xl min-h-96">
                        <FileUpload
                            onChange={handleFileUpload}
                            disabled={loading}
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={loading || files.length === 0}
                            onClick={handleSubmit}
                        >
                            {loading ? "Uploading..." : "Submit"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
