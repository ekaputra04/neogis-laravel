import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { buttonLinkCss } from "@/consts/buttonCss";
import { StreetWithCoordinatesInterface } from "@/types/types";
import { Button } from "./ui/button";
import {
    handleDownloadExcel,
    handleDownloadJson,
    handleDownloadPdf,
} from "@/lib/utils";
import { Download, FileJson, FileText, Table2 } from "lucide-react";

interface DialogDownloadStreetDataProps {
    streets: StreetWithCoordinatesInterface[];
}

export default function DialogDownloadStreetData({
    streets,
}: DialogDownloadStreetDataProps) {
    return (
        <div className="">
            <Dialog>
                <DialogTrigger className={buttonLinkCss + " w-full mb-2"}>
                    <Download /> Download Street Data
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Select the format file</DialogTitle>
                        <DialogDescription>
                            Choose the file format you want to download
                        </DialogDescription>
                    </DialogHeader>
                    <Button
                        className="mb-2 w-full"
                        variant={"link"}
                        onClick={() => handleDownloadJson(streets)}
                    >
                        <FileJson /> Download JSON
                    </Button>
                    <Button
                        className="mb-2 w-full"
                        variant={"link"}
                        onClick={() => handleDownloadExcel(streets)}
                    >
                        <Table2 /> Download Excel
                    </Button>
                    <Button
                        className="mb-2 w-full"
                        variant={"link"}
                        onClick={() => handleDownloadPdf(streets)}
                    >
                        <FileText /> Download Pdf
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}
