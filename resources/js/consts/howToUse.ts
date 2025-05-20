import { tutorialProps } from "@/types/types";

import imageSearch from "@/images/how-to-use/all/search.png";
import imageEye from "@/images/how-to-use/all/eye.png";
import imageMapControl from "@/images/how-to-use/all/map-control.png";

// Search Address
import imageBtnSearchAddress from "@/images/how-to-use/search-address/button-search.png";
import imageSheetFormSearch from "@/images/how-to-use/search-address/sheet-form.png";
import imageSheetResult from "@/images/how-to-use/search-address/result.png";

// Street Overview
import imageBtnAddStreet from "@/images/how-to-use/street-overview/button-add.png";
import imageBtnDownloadStreet from "@/images/how-to-use/street-overview/button-download.png";
import imageBtnFilterStreet from "@/images/how-to-use/street-overview/button-filter.png";
import imageDialogFilterStreet from "@/images/how-to-use/street-overview/dialog-filter.png";
import imageStreetCount from "@/images/how-to-use/street-overview/count.png";
import imageStreetPopUp from "@/images/how-to-use/street-overview/popup.png";

// Street Add
import imageFormStreetAdd from "@/images/how-to-use/street-add/form.png";
import imageAddLineMap from "@/images/how-to-use/street-add/add-line-map.png";
import imageDrawLineMap from "@/images/how-to-use/street-add/draw-line.png";
import imageOptionDrawLineMap from "@/images/how-to-use/street-add/option-draw.png";
import imageBtnSubmitAddStreet from "@/images/how-to-use/street-add/button-add.png";
import imageBtnAddFile from "@/images/how-to-use/street-add/button-add-file.png";

// Street Edit
import imageFormStreetEdit from "@/images/how-to-use/street-edit/form.png";
import imageMapStreetEdit from "@/images/how-to-use/street-edit/street-edit.png";
import imageBtnSubmitEditStreet from "@/images/how-to-use/street-edit/button-submit.png";

// Marker Overview
import imageBtnAddMarker from "@/images/how-to-use/marker-overview/btn-add.png";
import imageBtnDownloadMarker from "@/images/how-to-use/marker-overview/button-download.png";
import imageMarkerCount from "@/images/how-to-use/marker-overview/markerCount.png";
import imageMarkerMap from "@/images/how-to-use/marker-overview/marker.png";
import imageMarkerPopUp from "@/images/how-to-use/marker-overview/popup.png";

// Marker Add
import imageForm from "@/images/how-to-use/marker-add/form.png";
import imageBtnAdd from "@/images/how-to-use/marker-add/btn-add.png";
import imageBtnEdit from "@/images/how-to-use/marker-add/btn-edit.png";
import imageMarkerLocation from "@/images/how-to-use/marker-add/markerLocation.png";
import imageMarkerEdit from "@/images/how-to-use/marker-add/markerEdit.png";
import imageBtnDelete from "@/images/how-to-use/marker-add/btn-delete.png";
import imageBtnSubmit from "@/images/how-to-use/marker-edit/btn-submit.png";

// Line Overview
import imageBtnAddLine from "@/images/how-to-use/line-overview/btn-add.png";
import imageBtnDownloadLine from "@/images/how-to-use/line-overview/btn-download.png";
import imageLineCount from "@/images/how-to-use/line-overview/count.png";
import imageLinePopUp from "@/images/how-to-use/line-overview/popup.png";

// Line Add
import imageBtnSubmitLine from "@/images/how-to-use/line-add/btn-add.png";

// Polygon Overview
import imageBtnAddPolygon from "@/images/how-to-use/polygon-overview/btn-add.png";
import imageBtnDownloadPolygon from "@/images/how-to-use/polygon-overview/btn-download.png";
import imagePolygonCount from "@/images/how-to-use/polygon-overview/count.png";
import imagePolygonPopUp from "@/images/how-to-use/polygon-overview/popup.png";

// Polygon Add
import imageAddPolygonMap from "@/images/how-to-use/polygon-add/add-polygon-map.png";
import imageDrawPolygonMap from "@/images/how-to-use/polygon-add/draw.png";
import imageOptionDrawPolygonMap from "@/images/how-to-use/polygon-add/option-draw.png";
import imageSubmitPolygonAdd from "@/images/how-to-use/polygon-add/submit.png";

// Circle Overview
import imageBtnAddCircle from "@/images/how-to-use/circle-overview/btn-add.png";
import imageBtnDownloadCircle from "@/images/how-to-use/circle-overview/btn-download.png";
import imageCircleCount from "@/images/how-to-use/circle-overview/count.png";
import imageCirclePopUp from "@/images/how-to-use/circle-overview/popup.png";

// Circle Add
import imageAddCircleMap from "@/images/how-to-use/circle-add/add.png";
import imageDrawCircleMap from "@/images/how-to-use/circle-add/draw.png";
import imageSubmitCircleAdd from "@/images/how-to-use/circle-add/submit.png";

// Circle Edit
import imageEditCircleMap from "@/images/how-to-use/circle-edit/edit.png";

const HowToUseSearchAddress: tutorialProps[] = [
    {
        description:
            "Pengguna bisa mencari alamat dengan mengklik tombol 'Search Address'",
        image: imageBtnSearchAddress,
    },
    {
        description:
            "Masukkan alamat yang ingin dicari pada form yang disediakan",
        image: imageSheetFormSearch,
    },
    {
        description:
            "Jika alamat ditemukan, maka akan muncul hasil pencarian pada tabel di bawah form, klik lokasi yang dituju dan maps akan menampilkan lokasi tersebut",
        image: imageSheetResult,
    },
];

export const HowToUseStreetOverview: tutorialProps[] = [
    ...HowToUseSearchAddress,
    {
        description: "Tambahkan jalan dengan mengklik tombol 'Add New Street'",
        image: imageBtnAddStreet,
    },
    {
        description:
            "Download data jalan dengan mengklik tombol 'Download Street Data'",
        image: imageBtnDownloadStreet,
    },
    {
        description: "Filter data jalan dengan mengklik tombol 'Filter'",
        image: imageBtnFilterStreet,
    },
    {
        description:
            "Filter data jalan dengan mengisi form yang disediakan, kemudian klik tombol 'Apply'",
        image: imageDialogFilterStreet,
    },
    {
        description:
            "Bisa juga melakukan filter berdasarkan nama jalan pada input 'Search'",
        image: imageSearch,
    },
    {
        description: "Jumlah jalan terlihat dari indikator jumlah",
        image: imageStreetCount,
    },
    {
        description: "Klik icon mata untuk memfokuskan peta ke lokasi tujuan",
        image: imageEye,
    },
    {
        description:
            "Klik jalan pada map untuk melihat detail jalan. Jika ingin memperbarui data jalan, klik tombol 'Edit' pada pop up yang muncul. Jika ingin menghapus jalan, klik tombol 'Delete'",
        image: imageStreetPopUp,
    },
];

export const HowToUseStreetAdd: tutorialProps[] = [
    ...HowToUseSearchAddress,
    {
        description:
            "Pengguna bisa melakukan input manual atau mengupload file JSON yang berisi data jalan melalui tombol 'Add via file'",
        image: imageBtnAddFile,
    },
    {
        description:
            "Jika menginput manual, tambahkan ruas Jalan dengan mengklik tombol garis di kanan atas peta",
        image: imageAddLineMap,
    },
    {
        description: "Gambar ruas jalan dengan mengklik pada map",
        image: imageDrawLineMap,
    },
    {
        description:
            "Setelah selesai menggambar, klik tombol 'Finish' untuk menyimpan data. Atau jika ingin menghapus titik terakkhir, klik tombol 'Delete last point'",
        image: imageOptionDrawLineMap,
    },
    {
        description: "Tambahkan data jalan dengan mengisi form yang disediakan",
        image: imageFormStreetAdd,
    },
    {
        description:
            "Setelah semua data diinput, klik tombol 'Add Street' untuk menyimpan data jalan",
        image: imageBtnSubmitAddStreet,
    },
];

export const HowToUseStreetUpdate: tutorialProps[] = [
    {
        description: "Perbarui data jalan pada form yang disediakan.",
        image: imageFormStreetEdit,
    },
    {
        description:
            "Jika ingin memperbarui ruas jalan, klik tombol edit di pojok kanan atas peta.",
        image: imageBtnEdit,
    },
    {
        description: "Perbarui ruas jalan dengan menarik titik-titik jalan.",
        image: imageMapStreetEdit,
    },
    {
        description:
            "Setelah semua data diupdate, klik tombol 'Edit Street' untuk menyimpan perbaruan jalan.",
        image: imageBtnSubmitEditStreet,
    },
];

export const HowToUseMarkerOverview: tutorialProps[] = [
    ...HowToUseSearchAddress,
    {
        description: "Tambahkan marker dengan mengklik tombol 'Add New Marker'",
        image: imageBtnAddMarker,
    },
    {
        description:
            "Download data marker dengan mengklik tombol 'Download Marker Data'",
        image: imageBtnDownloadMarker,
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
        description: "Klik icon mata untuk memfokuskan peta ke lokasi tujuan",
        image: imageEye,
    },
    {
        description: "Posisi marker pada peta ditandai dengan icon berikut",
        image: imageMarkerMap,
    },
    {
        description:
            "Klik marker pada map untuk melihat detail marker. Jika ingin memperbarui data marker, klik tombol 'Edit' pada pop up yang muncul. Jika ingin menghapus marker, klik tombol 'Delete'",
        image: imageMarkerPopUp,
    },
];

export const HowToUseMarkerAdd: tutorialProps[] = [
    ...HowToUseSearchAddress,
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
            "Perbarui posisi lokasi dengan menarik marker ke lokasi yang baru.",
        image: imageMarkerEdit,
    },
    {
        description:
            "Jika ingin menghapus marker, klik tombol delete di pojok kanan atas peta.",
        image: imageBtnDelete,
    },
    {
        description:
            "Setelah semua data diinput, klik tombol 'Add New Marker' untuk menyimpan marker.",
        image: imageBtnAddMarker,
    },
];

export const HowToUseMarkerUpdate: tutorialProps[] = [
    {
        description:
            "Perbarui nama, deskripsi, dan kategori pada form yang disediakan.",
        image: imageForm,
    },
    {
        description:
            "Jika ingin memperbarui lokasi marker, klik tombol edit di pojok kanan atas peta.",
        image: imageBtnEdit,
    },
    {
        description:
            "Perbarui posisi lokasi dengan menarik marker ke lokasi yang baru.",
        image: imageMarkerEdit,
    },
    {
        description:
            "Setelah semua data diupdate, klik tombol 'Submit' untuk menyimpan perbaruan marker.",
        image: imageBtnSubmit,
    },
];

export const HowToUseLineOverview: tutorialProps[] = [
    ...HowToUseSearchAddress,
    {
        description: "Tambahkan line dengan mengklik tombol 'Add New Line'",
        image: imageBtnAddLine,
    },
    {
        description:
            "Download data line dengan mengklik tombol 'Download Line Data'",
        image: imageBtnDownloadLine,
    },
    {
        description: "Cari line dengan input pada tombol 'Search'",
        image: imageSearch,
    },
    {
        description: "Jumlah line terlihat dari indikator jumlah",
        image: imageLineCount,
    },
    {
        description: "Klik icon mata untuk memfokuskan peta ke lokasi tujuan",
        image: imageEye,
    },
    {
        description:
            "Klik line pada map untuk melihat detail line. Jika ingin memperbarui data line, klik tombol 'Edit' pada pop up yang muncul. Jika ingin menghapus line, klik tombol 'Delete'",
        image: imageLinePopUp,
    },
];

export const HowToUseLineAdd: tutorialProps[] = [
    ...HowToUseSearchAddress,
    {
        description:
            "Tambahkan nama, deskripsi, dan kategori pada form yang disediakan.",
        image: imageForm,
    },
    {
        description:
            "Tambahkan line dengan mengklik terlebih dahulu tombol garis di pojok kanan atas peta.",
        image: imageAddLineMap,
    },
    {
        description: "Gambar garis dengan mengklik pada map",
        image: imageDrawLineMap,
    },
    {
        description:
            "Setelah selesai menggambar, klik tombol 'Finish' untuk menyimpan data. Atau jika ingin menghapus titik terakkhir, klik tombol 'Delete last point'",
        image: imageOptionDrawLineMap,
    },
    {
        description:
            "Jika ingin memperbarui garis, klik tombol edit di pojok kanan atas peta.",
        image: imageBtnEdit,
    },
    {
        description: "Perbarui garis dengan menarik titik-titik jalan.",
        image: imageMapStreetEdit,
    },
    {
        description:
            "Setelah semua data diinput, klik tombol 'Add Line' untuk menyimpan garis.",
        image: imageBtnSubmitLine,
    },
];

export const HowToUseLineUpdate: tutorialProps[] = [
    {
        description:
            "Perbarui nama, deskripsi, dan kategori pada form yang disediakan.",
        image: imageForm,
    },
    {
        description:
            "Jika ingin memperbarui posisi garis, klik tombol edit di pojok kanan atas peta.",
        image: imageBtnEdit,
    },
    {
        description: "Perbarui garis dengan menarik titik-titik jalan.",
        image: imageMapStreetEdit,
    },
    {
        description:
            "Setelah semua data diupdate, klik tombol 'Submit' untuk menyimpan perbaruan marker.",
        image: imageBtnSubmit,
    },
];

export const HowToUsePolygonOverview: tutorialProps[] = [
    ...HowToUseSearchAddress,
    {
        description:
            "Tambahkan polygon dengan mengklik tombol 'Add New Polygon'",
        image: imageBtnAddPolygon,
    },
    {
        description:
            "Download data polygon dengan mengklik tombol 'Download Polygon Data'",
        image: imageBtnDownloadPolygon,
    },
    {
        description: "Cari polygon dengan input pada tombol 'Search'",
        image: imageSearch,
    },
    {
        description: "Jumlah polygon terlihat dari indikator jumlah",
        image: imagePolygonCount,
    },
    {
        description: "Klik icon mata untuk memfokuskan peta ke lokasi tujuan",
        image: imageEye,
    },
    {
        description:
            "Klik polygon pada map untuk melihat detail polygon. Jika ingin memperbarui data polygon, klik tombol 'Edit' pada pop up yang muncul. Jika ingin menghapus polygon, klik tombol 'Delete'",
        image: imagePolygonPopUp,
    },
];

export const HowToUsePolygonAdd: tutorialProps[] = [
    ...HowToUseSearchAddress,
    {
        description:
            "Tambahkan nama, deskripsi, dan kategori pada form yang disediakan.",
        image: imageForm,
    },
    {
        description:
            "Tambahkan polygon dengan mengklik terlebih dahulu tombol garis di pojok kanan atas peta.",
        image: imageAddPolygonMap,
    },
    {
        description: "Gambar polygon dengan mengklik pada map",
        image: imageDrawPolygonMap,
    },
    {
        description:
            "Setelah selesai menggambar, klik tombol 'Finish' untuk menyimpan data. Atau jika ingin menghapus titik terakkhir, klik tombol 'Delete last point'",
        image: imageOptionDrawPolygonMap,
    },
    {
        description:
            "Jika ingin memperbarui polygon, klik tombol edit di pojok kanan atas peta.",
        image: imageBtnEdit,
    },
    {
        description:
            "Setelah semua data diinput, klik tombol 'Add Polygon' untuk menyimpan garis.",
        image: imageSubmitPolygonAdd,
    },
];

export const HowToUsePolygonUpdate: tutorialProps[] = [
    {
        description:
            "Perbarui nama, deskripsi, dan kategori pada form yang disediakan.",
        image: imageForm,
    },
    {
        description:
            "Jika ingin memperbarui posisi polygon, klik tombol edit di pojok kanan atas peta.",
        image: imageBtnEdit,
    },
    {
        description: "Perbarui posisi polygon dengan mengubah posisi titik.",
        image: imageDrawPolygonMap,
    },
    {
        description:
            "Setelah semua data diupdate, klik tombol 'Submit' untuk menyimpan perbaruan polygon.",
        image: imageBtnSubmit,
    },
];

export const HowToUseCircleOverview: tutorialProps[] = [
    ...HowToUseSearchAddress,
    {
        description: "Tambahkan circle dengan mengklik tombol 'Add New Circle'",
        image: imageBtnAddCircle,
    },
    {
        description:
            "Download data circle dengan mengklik tombol 'Download Circle Data'",
        image: imageBtnDownloadCircle,
    },
    {
        description: "Cari circle dengan input pada tombol 'Search'",
        image: imageSearch,
    },
    {
        description: "Jumlah circle terlihat dari indikator jumlah",
        image: imageCircleCount,
    },
    {
        description: "Klik icon mata untuk memfokuskan peta ke lokasi tujuan",
        image: imageEye,
    },
    {
        description:
            "Klik circle pada map untuk melihat detail circle. Jika ingin memperbarui data circle, klik tombol 'Edit' pada pop up yang muncul. Jika ingin menghapus circle, klik tombol 'Delete'",
        image: imageCirclePopUp,
    },
];

export const HowToUseCircleAdd: tutorialProps[] = [
    ...HowToUseSearchAddress,
    {
        description:
            "Tambahkan nama, deskripsi, dan kategori pada form yang disediakan.",
        image: imageForm,
    },
    {
        description:
            "Tambahkan circle dengan mengklik terlebih dahulu tombol garis di pojok kanan atas peta.",
        image: imageAddCircleMap,
    },
    {
        description: "Gambar circle dengan mengklik pada map",
        image: imageDrawCircleMap,
    },
    {
        description:
            "Jika ingin memperbarui circle, klik tombol edit di pojok kanan atas peta.",
        image: imageBtnEdit,
    },
    {
        description:
            "Setelah semua data diinput, klik tombol 'Add Circle' untuk menyimpan garis.",
        image: imageSubmitCircleAdd,
    },
];

export const HowToUseCircleUpdate: tutorialProps[] = [
    {
        description:
            "Perbarui nama, deskripsi, dan kategori pada form yang disediakan.",
        image: imageForm,
    },
    {
        description:
            "Jika ingin memperbarui posisi circle, klik tombol edit di pojok kanan atas peta.",
        image: imageBtnEdit,
    },
    {
        description: "Perbarui posisi circle dengan mengubah posisi titik.",
        image: imageEditCircleMap,
    },
    {
        description:
            "Setelah semua data diupdate, klik tombol 'Submit' untuk menyimpan perbaruan circle.",
        image: imageBtnSubmit,
    },
];
