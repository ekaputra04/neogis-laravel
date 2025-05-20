import AuthButton from "@/Components/AuthButton";
import { FaQComponent } from "@/Components/FaQ";
import Footer from "@/Components/Footer";
import { GradientButton } from "@/Components/GradientButton";
import { HeroParallaxDemo } from "@/Components/HeroParallax";
import { InfiniteMovingCardsDemo } from "@/Components/InfiniteMovingCards";
import { InteractiveHoverButton } from "@/Components/magicui/interactive-hover-button";
import { RainbowButton } from "@/Components/magicui/rainbow-button";
import { ParticlesBackground } from "@/Components/ParticlesBackground";
import { ParticlesBackgroundDark } from "@/Components/ParticlesBackgroundDark";
import { ToolsUsed } from "@/Components/ToolsUsed";
import { FloatingNav } from "@/Components/ui/floating-navbar";
import { ThemeProvider } from "@/Components/ui/theme-provider";
import { useThemeStore } from "@/Store/themeStore";
import { UserInterface } from "@/types/types";
import { Head, Link } from "@inertiajs/react";
import { GithubIcon, Home, LayoutDashboard, User } from "lucide-react";

interface HomePageProps {
    auth: {
        user: UserInterface | null;
    };
}

const navItems = [
    {
        name: "Home",
        link: "/",
        icon: <Home className="w-4 h-4 text-neutral-500 dark:text-white" />,
    },
    {
        name: "Dashboard",
        link: "/dashboard",
        icon: (
            <LayoutDashboard className="w-4 h-4 text-neutral-500 dark:text-white" />
        ),
    },
    {
        name: "Profile",
        link: "/profile",
        icon: <User className="w-4 h-4 text-neutral-500 dark:text-white" />,
    },
];

export default function HomePage({ auth }: HomePageProps) {
    const { theme } = useThemeStore();
    return (
        <ThemeProvider>
            <div className="relative">
                <Head title="Home" />
                <FloatingNav navItems={navItems} />
                <AuthButton auth={auth} />
                <div className="bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-4 p-[1px] w-full" />

                <main className="flex flex-col justify-start items-center p-8 md:px-16 lg:px-32 pt-8 lg:pb-16 w-full">
                    <GradientButton text="Introducing" />
                    <div className="space-y-8 mt-4">
                        <p className="bg-clip-text bg-gradient-to-b from-black dark:from-white to-gray-300/80 dark:to-slate-900/10 font-semibold text-transparent text-6xl text-center leading-none whitespace-pre-wrap pointer-events-none">
                            NeoGIS
                        </p>

                        <p className="mx-auto py-4 text-neutral-500 text-sm md:text-lg text-center">
                            Navigate smarter with cutting-edge GIS technology,
                            explore deeper with detailed spatial insights, and
                            map with precision using advanced geolocation tools.
                            Unlock the power of geographic data to visualize,
                            analyze, and make informed decisions with ease!
                        </p>

                        <ToolsUsed />
                    </div>

                    <div className="flex md:flex-row flex-col justify-center items-center gap-4 w-full">
                        <div className="">
                            <Link
                                href={"/dashboard"}
                                className="block md:my-16 mt-16"
                            >
                                <RainbowButton className="gap-2 rounded-full">
                                    <LayoutDashboard className="w-6 h-6" />
                                    Explore Dashboard
                                </RainbowButton>
                            </Link>
                        </div>
                        <div className="">
                            <a
                                href="https://github.com/ekaputra04/neogis-laravel.git"
                                className="flex justify-center mx-auto md:my-16 w-full"
                                target="_blank"
                            >
                                <InteractiveHoverButton>
                                    <div className="flex gap-2">
                                        <GithubIcon className="w-6 h-6" />{" "}
                                        Github
                                    </div>
                                </InteractiveHoverButton>
                            </a>
                        </div>
                    </div>

                    <HeroParallaxDemo />

                    <FaQComponent />

                    <InfiniteMovingCardsDemo />
                    <Footer />
                </main>

                <div className="top-0 left-0 -z-10 fixed w-full h-screen">
                    {theme == "light" ? (
                        <ParticlesBackground />
                    ) : (
                        <ParticlesBackgroundDark />
                    )}
                </div>
            </div>
        </ThemeProvider>
    );
}
