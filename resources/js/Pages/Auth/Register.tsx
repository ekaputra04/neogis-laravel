import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import image from "@/images/background/sign-up-bg.jpg";
import { Button } from "@/Components/ui/button";
import { ThemeProvider } from "@/Components/ui/theme-provider";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <>
            <ThemeProvider>
                <Head title="Register" />

                <div className="flex w-screen h-screen md:overflow-y-hidden">
                    <div className="flex justify-center items-center px-8 md:px-16 lg:px-32 w-full md:w-1/2">
                        <div className="flex flex-col flex-1 space-y-8 min-w-64">
                            <h1 className="font-medium text-2xl">Join Us 🌍</h1>
                            <p className="text-foreground text-sm">
                                Start exploring and managing geographic
                                information more efficiently. Sign up now to
                                unlock full access!
                            </p>

                            <form onSubmit={submit}>
                                <div>
                                    <InputLabel htmlFor="name" value="Name" />

                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="block mt-1 w-full"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                    />

                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="email" value="Email" />

                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="block mt-1 w-full"
                                        autoComplete="username"
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        required
                                    />

                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="password"
                                        value="Password"
                                    />

                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="block mt-1 w-full"
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        required
                                    />

                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Confirm Password"
                                    />

                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="block mt-1 w-full"
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex justify-end items-center mt-4">
                                    <Link
                                        href={route("login")}
                                        className="rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-gray-600 hover:text-gray-900 text-sm underline"
                                    >
                                        Already registered?
                                    </Link>

                                    <Button
                                        className="ms-4 px-8 py-2"
                                        disabled={processing}
                                    >
                                        Register
                                    </Button>
                                </div>
                            </form>

                            <p className="text-foreground text-sm text">
                                Already have an account?{" "}
                                <Link
                                    className="font-medium text-primary underline"
                                    href="/login"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:flex w-full md:w-1/2 h-screen">
                        <img
                            src={image}
                            alt="tengkorak"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </ThemeProvider>
        </>
    );
}
