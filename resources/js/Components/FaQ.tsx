import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";

const faqs = [
    {
        value: "item-1",
        question: "Apa itu Sistem Informasi Geografis (SIG)?",
        answer: "Sistem Informasi Geografis (SIG) adalah sistem yang digunakan untuk mengelola, menganalisis, dan memvisualisasikan data berbasis lokasi yang terdapat di permukaan bumi.",
    },
    {
        value: "item-2",
        question: "Bagaimana cara menambahkan marker pada peta?",
        answer: "Anda dapat menambahkan marker melalui dashboard admin dengan mengisi informasi seperti nama, deskripsi, dan koordinat titik lokasi (latitude & longitude).",
    },
    {
        value: "item-3",
        question: "Bagaimana cara menambahkan garis (line) di peta?",
        answer: "Untuk menambahkan garis, Anda bisa memasukkan serangkaian titik koordinat yang akan membentuk satu garis terhubung (LineString). Hal ini dapat dilakukan melalui dashboard admin.",
    },
    {
        value: "item-4",
        question: "Bagaimana cara mengubah tampilan peta (basemap)?",
        answer: "Anda dapat memilih layer peta yang berbeda melalui menu Settings. Sistem mendukung beberapa opsi seperti Satellite, StreetMap, Topografi, dll.",
    },
    {
        value: "item-5",
        question: "Apakah data bisa difilter berdasarkan nama?",
        answer: "Ya, sistem mendukung fitur pencarian dan filter data berdasarkan nama yang Anda ketikkan.",
    },
    {
        value: "item-6",
        question: "Apakah sistem ini bisa digunakan di perangkat mobile?",
        answer: "Tentu! Sistem ini responsif dan dapat diakses melalui berbagai perangkat termasuk smartphone dan tablet.",
    },
    {
        value: "item-8",
        question: "Apakah sistem ini mendukung fitur autentikasi?",
        answer: "Ya, sistem ini menggunakan autentikasi aman untuk membatasi akses hanya kepada pengguna yang terdaftar dan login.",
    },
    {
        value: "item-9",
        question: "Apakah tersedia fitur export data?",
        answer: "Ya, data dapat diekspor dalam format JSON untuk keperluan analisis lanjutan.",
    },
    {
        value: "item-10",
        question:
            "Bagaimana cara menghitung panjang ruas jalan secara otomatis?",
        answer: "Panjang ruas jalan dihitung otomatis oleh sistem berdasarkan koordinat GPS yang Anda input. Hasilnya ditampilkan dalam satuan meter.",
    },
    {
        value: "item-11",
        question:
            "Apakah ada batasan jumlah marker/garis yang bisa ditambahkan?",
        answer: "Tidak ada batasan jumlah, namun untuk performa optimal, disarankan tidak lebih dari 10.000 fitur per peta.",
    },
    {
        value: "item-12",
        question: "Apakah sistem ini mendukung integrasi pihak ketiga?",
        answer: "Sistem dapat diintegrasikan dengan API eksternal seperti OpenStreetMap atau Google Maps untuk data real-time.",
    },
    {
        value: "item-13",
        question:
            "Bagaimana cara kerja fitur filter berdasarkan jenis/kondisi jalan?",
        answer: "Anda bisa menggunakan panel filter di sebelah kiri untuk memilih kombinasi kriteria (jenis jalan, kondisi, dll). Hasil akan langsung diperbarui di peta dan tabel.",
    },
    {
        value: "item-14",
        question: "Apakah data ruas jalan bisa diimpor dari file JSON?",
        answer: "Ya, sistem mendukung impor data dalam format JSON dengan atribut terkait.",
    },
    {
        value: "item-16",
        question:
            "Bagaimana cara mengklik jalan di peta untuk melihat detailnya?",
        answer: "Klik sekali pada garis jalan di peta, lalu informasi detail seperti nama, panjang, lebar, dan kondisi akan muncul di popup.",
    },
    {
        value: "item-19",
        question: "Apakah perubahan data langsung tersimpan otomatis?",
        answer: "Ya, semua perubahan (tambah/edit/hapus) langsung tersimpan di database. Pastikan koneksi internet stabil saat bekerja.",
    },
    {
        value: "item-21",
        question:
            "Mengapa beberapa jalan tidak muncul setelah saya apply filter?",
        answer: "Pastikan Anda tidak memilih filter yang saling bertentangan (misal: memilih jenis 'Tol' tapi kondisi 'Rusak' - jika tidak ada data yang memenuhi kedua kriteria tersebut, hasil akan kosong).",
    },
    {
        value: "item-15",
        question: "Bagaimana jika saya mengalami masalah teknis?",
        answer: "Silakan hubungi tim pengembang melalui email (ekaputrajuniawan@gmail.com) untuk bantuan lebih lanjut.",
    },
];

export function FaQComponent() {
    return (
        <div className="mx-auto my-16 w-full lg:w-1/2">
            <h2 className="bg-clip-text bg-gradient-to-b from-black dark:from-white to-gray-300/80 dark:to-slate-900/10 mb-16 font-semibold text-transparent text-4xl text-center leading-none whitespace-pre-wrap pointer-events-none">
                Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible>
                {faqs.map((faq) => (
                    <AccordionItem key={faq.value} value={faq.value}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
