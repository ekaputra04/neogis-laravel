import { tutorialProps } from "@/types/types";

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

export const HowToUseMarkerOverview: tutorialProps[] = [
    {
        description: "Tambahkan marker dengan mengklik tombol 'Add New Marker'",
        image: imageAddMarker,
    },
    {
        description: "Cari marker dengan input pada tombol 'Search'",
        image: imageSearch,
    },
    {
        description: "Jumlah marker terlihat dari indikator jumlah",
        image: imageMarkerCount,
    },
    {
        description: "Posisi marker pada peta ditandai dengan icon berikut",
        image: imageMarker,
    },
    {
        description:
            "Keterangan marker dapat dilihat dengan meng-klik icon marker. Terdapat nama, deskripsi, dan foto marker, dan kategori dari marker. Klik tombol 'Edit' untuk memperbarui data marker dan klik tombol 'Delete' untuk menghapus marker",
        image: imageForm,
    },
    {
        description: "",
        image: imageMarkerPopUp,
    },
];

export const HowToUseMarkerAdd: tutorialProps[] = [
    {
        description:
            "Tambahkan nama, deskripsi, dan kategori pada form yang disediakan.",
        image: imageForm,
    },
    {
        description:
            "Tambahkan lokasi marker dengan mengklik terlebih dahulu tombol location di pojok kanan atas peta.",
        image: imageBtnAdd,
    },
    {
        description:
            "Arahkan marker ke lokasi yang diinginkan, tahan gambar lalu lepaskan.",
        image: imageMarkerLocation,
    },
    {
        description:
            "Jika ingin memperbarui lokasi marker, klik tombol edit di pojok kanan atas peta.",
        image: imageBtnEdit,
    },
    {
        description:
            "Perbarui posisi lokasi dengan menarik markerke lokasi yang baru.",
        image: imageMarkerEdit,
    },
    {
        description:
            "Jika ingin menghapus marker, klik tombol delete di pojok kanan atas peta.",
        image: imageBtnDelete,
    },
    {
        description:
            "Setelah semua data diinput, klik tombol 'Add Marker' untuk menyimpan marker.",
        image: imageBtnSubmit,
    },
];
