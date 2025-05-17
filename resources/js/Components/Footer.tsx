export default function Footer() {
    return (
        <>
            <div className="flex flex-col justify-center my-4 w-full">
                <div className="bg-gradient-to-r from-transparent via-foreground/10 to-transparent mb-2 p-[1px] w-full" />
                <p className="mt-2 text-primary/70 text-center">
                    © 2025 by{" "}
                    <a href="https://github.com/ekaputra04">
                        <span className="hover:underline">
                            I Putu Eka Putra Juniawan
                        </span>
                    </a>{" "}
                    | Sistem Informasi Geografis
                </p>
            </div>
        </>
    );
}
