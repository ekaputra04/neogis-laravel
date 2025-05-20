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
        question: "Bagaimana cara mengetahui siapa pengguna yang login?",
        answer: "Informasi pengguna yang login dapat diakses melalui sistem autentikasi. Di frontend, data user dapat diambil dari `usePage().props.auth.user`.",
    },
    {
        value: "item-5",
        question: "Apakah data bisa difilter berdasarkan nama?",
        answer: "Ya, sistem mendukung fitur pencarian dan filter data marker berdasarkan nama atau kategori yang Anda ketikkan.",
    },
    {
        value: "item-6",
        question: "Apakah sistem ini bisa digunakan di perangkat mobile?",
        answer: "Tentu! Sistem ini responsif dan dapat diakses melalui berbagai perangkat termasuk smartphone dan tablet.",
    },
    {
        value: "item-7",
        question: "Apakah saya bisa mengelompokkan zona dalam kategori?",
        answer: "Ya, Anda dapat menambahkan kategori untuk setiap marker atau zona seperti zona rawan, pemantauan, dan lainnya.",
    },
    {
        value: "item-8",
        question: "Apakah sistem ini mendukung fitur autentikasi?",
        answer: "Ya, sistem ini menggunakan autentikasi aman untuk membatasi akses hanya kepada pengguna yang terdaftar dan login.",
    },
    {
        value: "item-9",
        question: "Apakah tersedia fitur export data?",
        answer: "Ya, data dapat diekspor dalam format seperti CSV atau GeoJSON untuk keperluan analisis lanjutan.",
    },
    {
        value: "item-10",
        question: "Apakah saya bisa mengatur notifikasi?",
        answer: "Fitur notifikasi dapat ditambahkan agar pengguna mendapatkan informasi ketika zona atau data tertentu diperbarui.",
    },
    {
        value: "item-11",
        question: "Apakah tersedia histori perubahan data?",
        answer: "Ya, sistem mencatat log perubahan data termasuk siapa yang mengubah dan kapan perubahan dilakukan.",
    },
    {
        value: "item-12",
        question: "Apakah sistem ini mendukung integrasi pihak ketiga?",
        answer: "Sistem dapat diintegrasikan dengan API eksternal seperti OpenStreetMap, Google Maps, atau IoT sensor untuk data real-time.",
    },
    {
        value: "item-13",
        question: "Apakah bisa menampilkan data real-time di peta?",
        answer: "Ya, sistem mendukung integrasi dengan data real-time seperti data sensor atau pelaporan langsung dari pengguna.",
    },
    {
        value: "item-14",
        question: "Apakah saya bisa berbagi peta dengan tim saya?",
        answer: "Peta dapat dibagikan melalui tautan khusus atau diekspor dalam format umum yang dapat dibuka di software GIS lainnya.",
    },
    {
        value: "item-15",
        question: "Bagaimana jika saya mengalami masalah teknis?",
        answer: "Silakan hubungi tim support kami melalui email atau live chat yang tersedia di dashboard untuk bantuan lebih lanjut.",
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
