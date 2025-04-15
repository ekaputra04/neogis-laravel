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
        answer: "Sistem Informasi Geografis (SIG) adalah sistem yang dirancang untuk mengumpulkan, menyimpan, menganalisis, dan memvisualisasikan data yang berkaitan dengan lokasi di permukaan bumi.",
    },
    {
        value: "item-2",
        question: "Bagaimana cara menambahkan zona baru pada peta?",
        answer: "Anda dapat menambahkan zona baru melalui dashboard admin dengan menentukan pusat koordinat, radius, nama zona, deskripsi, dan kategori zona.",
    },
    {
        value: "item-3",
        question: "Apakah sistem ini mendukung data real-time?",
        answer: "Ya, sistem ini mendukung integrasi dengan data real-time seperti sensor lokasi atau laporan langsung dari pengguna lapangan.",
    },
    {
        value: "item-4",
        question: "Apakah saya bisa mengekspor data dari sistem ini?",
        answer: "Ya, Anda dapat mengekspor data dalam berbagai format seperti CSV, GeoJSON, atau Shapefile untuk keperluan analisis lebih lanjut.",
    },
    {
        value: "item-5",
        question: "Bagaimana dengan keamanan data?",
        answer: "Sistem ini menggunakan autentikasi pengguna yang aman serta enkripsi data untuk memastikan informasi sensitif tetap terlindungi.",
    },
    {
        value: "item-6",
        question: "Apakah sistem ini bisa digunakan di perangkat mobile?",
        answer: "Tentu! Sistem ini responsif dan dapat diakses melalui berbagai perangkat termasuk smartphone dan tablet.",
    },
    {
        value: "item-7",
        question:
            "Apakah saya bisa mengatur kategori untuk zona yang saya buat?",
        answer: "Ya, Anda dapat membuat dan mengelola berbagai kategori zona sesuai kebutuhan seperti zona rawan bencana, area pemantauan, atau kawasan konservasi.",
    },
    {
        value: "item-8",
        question: "Bagaimana cara membagikan peta dengan tim saya?",
        answer: "Peta dapat dibagikan melalui link khusus atau diekspor dalam format yang dapat dibuka di berbagai aplikasi GIS lainnya.",
    },
    {
        value: "item-9",
        question: "Apakah ada fitur untuk pencarian lokasi?",
        answer: "Ya, sistem dilengkapi dengan fitur pencarian lokasi untuk memudahkan pengguna menemukan zona atau titik koordinat tertentu.",
    },
    {
        value: "item-10",
        question: "Bagaimana sistem menangani pembaruan data?",
        answer: "Data diperbarui secara otomatis ketika pengguna melakukan perubahan. Selain itu, admin juga dapat melakukan sinkronisasi manual jika diperlukan.",
    },
    {
        value: "item-11",
        question: "Apakah saya bisa melihat histori perubahan data?",
        answer: "Ya, sistem menyediakan log histori perubahan sehingga Anda dapat melacak siapa yang melakukan perubahan dan kapan perubahan tersebut dilakukan.",
    },
    {
        value: "item-12",
        question: "Apakah sistem mendukung integrasi dengan platform lain?",
        answer: "Sistem ini mendukung integrasi dengan berbagai API eksternal seperti OpenStreetMap, Google Maps, dan platform IoT untuk data sensor.",
    },
    {
        value: "item-13",
        question: "Apakah tersedia fitur notifikasi?",
        answer: "Ya, Anda bisa mengatur notifikasi untuk mendapatkan pembaruan terkait zona tertentu atau ketika terjadi perubahan penting.",
    },
    {
        value: "item-14",
        question: "Apakah ada batasan jumlah zona yang bisa dibuat?",
        answer: "Tidak ada batasan jumlah zona, Anda bebas membuat sebanyak yang diperlukan sesuai dengan kapasitas penyimpanan server.",
    },
    {
        value: "item-15",
        question: "Bagaimana jika saya mengalami kendala teknis?",
        answer: "Tim support kami siap membantu Anda. Silakan hubungi kami melalui email support atau fitur live chat yang tersedia di dashboard.",
    },
];

export function FaQComponent() {
    return (
        <div className="my-16 max-w-4xl">
            <h2 className="bg-clip-text bg-gradient-to-b from-black dark:from-white to-gray-300/80 dark:to-slate-900/10 mb-16 font-semibold text-transparent text-4xl text-center leading-none whitespace-pre-wrap pointer-events-none">
                Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
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
