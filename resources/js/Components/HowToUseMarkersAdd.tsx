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
import imageForm from "@/images/how-to-use/marker-add/form.png";
import imageBtnAdd from "@/images/how-to-use/marker-add/btn-add.png";
import imageBtnEdit from "@/images/how-to-use/marker-add/btn-edit.png";
import imageMarkerLocation from "@/images/how-to-use/marker-add/markerLocation.png";
import imageMarkerEdit from "@/images/how-to-use/marker-add/markerEdit.png";
import imageBtnDelete from "@/images/how-to-use/marker-add/btn-delete.png";
import imageBtnSubmit from "@/images/how-to-use/marker-add/btn-submit.png";

export default function HowToUseMarkersAdd() {
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
                                    Tambahkan nama, deskripsi, dan kategori pada
                                    form yang disediakan
                                </h1>
                                <img src={imageForm} alt="Form Add Marker" />
                            </div>
                            <div className="space-y-2">
                                <h1>
                                    Tambahkan lokasi marker dengan mengklik
                                    terlebih dahulu tombol location di pojok
                                    kanan atas peta.
                                </h1>
                                <img src={imageBtnAdd} alt="Add Marker" />
                            </div>
                            <div className="space-y-2">
                                <h1>
                                    Arahkan marker ke lokasi yang diinginkan,
                                    tahan gambar lalu lepaskan
                                </h1>
                                <img
                                    src={imageMarkerLocation}
                                    alt="Marker location"
                                />
                            </div>
                            <div className="space-y-2">
                                <h1>
                                    Jika ingin memperbarui lokasi marker, klik
                                    tombol edit di pojok kanan atas peta.
                                </h1>
                                <img src={imageBtnEdit} alt="Marker Edit" />
                            </div>
                            <div className="space-y-2">
                                <h1>
                                    Perbarui posisi lokasi dengan menarik marker
                                    ke lokasi yang baru
                                </h1>
                                <img src={imageMarkerEdit} alt="Marker edit" />
                            </div>
                            <div className="space-y-2">
                                <h1>
                                    Jika ingin menghapus marker, klik tombol
                                    delete di pojok kanan atas peta
                                </h1>
                                <img src={imageBtnDelete} alt="Marker edit" />
                            </div>
                            <div className="space-y-2">
                                <h1>
                                    Setelah semua data diinput, klik tombol 'Add
                                    Marker' untuk menyimpan marker
                                </h1>
                                <img src={imageBtnSubmit} alt="Btn Submit" />
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}
