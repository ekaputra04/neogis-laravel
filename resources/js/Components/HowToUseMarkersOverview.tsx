import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { FileQuestion } from "lucide-react";
import imageAddMarker from "@/images/how-to-use/marker-overview/btn-add.png";
import imageSearch from "@/images/how-to-use/marker-overview/search.png";
import imageMarkerCount from "@/images/how-to-use/marker-overview/markerCount.png";
import imageMarker from "@/images/how-to-use/marker-overview/marker.png";
import imageMarkerPopUp from "@/images/how-to-use/marker-overview/markerPopUp.png";

export default function HowToUseMarkersOverview() {
    return (
        <div className="">
            <Dialog>
                <DialogTrigger className="inline-flex justify-center items-center gap-2 bg-background hover:bg-accent disabled:opacity-50 shadow-sm mb-4 px-3 py-1 border border-input rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full [&_svg]:size-4 font-medium dark:text-white text-sm whitespace-nowrap transition-colors hover:text-accent-foreground [&_svg]:pointer-events-none disabled:pointer-events-none [&_svg]:shrink-0">
                    <FileQuestion />
                    <p>How to Use</p>
                </DialogTrigger>
                <DialogContent className="max-h-96 overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="mb-4">
                            Petunjuk Penggunaan
                        </DialogTitle>
                        <DialogDescription className="space-y-4">
                            <div className="space-y-2">
                                <h1>
                                    Tambahkan marker dengan mengklik tombol 'Add
                                    New Marker'
                                </h1>
                                <img src={imageAddMarker} alt="Add Marker" />
                            </div>
                            <div className="space-y-2">
                                <h1>
                                    Cari marker dengan input pada tombol
                                    'Search'
                                </h1>
                                <img src={imageSearch} alt="Search Marker" />
                            </div>
                            <div className="space-y-2">
                                <h1>
                                    Jumlah marker terlihat dari indikator jumlah
                                </h1>
                                <img
                                    src={imageMarkerCount}
                                    alt="Marker count"
                                />
                            </div>
                            <div className="space-y-2">
                                <h1>
                                    Posisi marker pada peta ditandai dengan icon
                                    berikut
                                </h1>
                                <img src={imageMarker} alt="Marker" />
                            </div>
                            <div className="space-y-2">
                                <h1>
                                    Keterangan marker dapat dilihat dengan
                                    meng-klik icon marker. Terdapat nama,
                                    deskripsi, dan foto marker, dan kategori
                                    dari marker. Klik tombol 'Edit' untuk
                                    memperbarui data marker dan klik tombol
                                    'Delete' untuk menghapus marker
                                </h1>
                                <img
                                    src={imageMarkerPopUp}
                                    alt="Marker popup"
                                />
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}
