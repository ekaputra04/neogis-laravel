import { UserInterface } from "@/types/types";
import { Link } from "@inertiajs/react";
import { Button } from "./ui/button";
import Dropdown from "./Dropdown";
import { ModeToggle } from "./ui/mode-toggle";

interface AuthButtonProps {
    auth: {
        user: UserInterface | null;
    };
}

export default function AuthButton({ auth }: AuthButtonProps) {
    return (
        <nav className="">
            {auth.user ? (
                <div className="flex justify-between items-center px-8 md:px-16 lg:px-32 pt-4">
                    <h1 className="font-bold text-xl">NeoGIS</h1>

                    <div className="flex justify-between items-center gap-4">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-md focus:outline-none font-medium text-gray-500 hover:text-gray-700 text-sm leading-4 transition duration-150 ease-in-out"
                                    >
                                        <p className="dark:text-white">
                                            Hello, {auth.user.name}
                                        </p>
                                        <svg
                                            className="ms-2 -me-0.5 w-4 h-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </span>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route("maps.index")}>
                                    Dashboard
                                </Dropdown.Link>
                                <Dropdown.Link href={route("profile.edit")}>
                                    Profile
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                >
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                        <ModeToggle />
                    </div>
                </div>
            ) : (
                <div className="flex justify-between items-center px-8 md:px-16 lg:px-32 pt-4">
                    <h1 className="font-bold text-xl">NeoGIS</h1>
                    <div className="flex justify-end gap-2">
                        <Button asChild variant={"outline"}>
                            <Link href="/login">Sign in</Link>
                        </Button>
                        <Button asChild variant={"default"}>
                            <Link href="/register">Sign up</Link>
                        </Button>
                        <ModeToggle />
                    </div>
                </div>
            )}
        </nav>
    );
    // return auth.user ? (

    // ) : (
    //     <div className="flex justify-between items-center px-8 md:px-16 lg:px-32 pt-4">
    //         <h1 className="font-bold text-xl">NeoGIS</h1>
    //         <div className="flex justify-end gap-2">
    //             <Button asChild size="sm" variant={"outline"}>
    //                 <Link href="/sign-in">Sign in</Link>
    //             </Button>
    //             <Button asChild size="sm" variant={"default"}>
    //                 <Link href="/sign-up">Sign up</Link>
    //             </Button>
    //             <ModeToggle />
    //         </div>
    //     </div>
    // );
}
