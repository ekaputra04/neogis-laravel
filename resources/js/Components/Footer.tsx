export default function Footer() {
    return (
        <>
            <div className="flex flex-col justify-center mt-32 mb-4 w-full">
                <p className="bg-clip-text bg-gradient-to-b from-black dark:from-white to-gray-300/80 dark:to-slate-900/10 font-semibold text-transparent lg:text-[16rem] text-9xl text-center leading-none whitespace-pre-wrap pointer-events-none">
                    NeoGIS
                </p>
                <div className="bg-background -mt-12">
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
            </div>
        </>
    );
}
