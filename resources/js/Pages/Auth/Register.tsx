import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import image from "@/images/background/sign-up-bg.jpg";
import { Button } from "@/Components/ui/button";
import { ThemeProvider } from "@/Components/ui/theme-provider";
import { Badge } from "@/Components/ui/badge";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";

type RegisterErrors = {
    name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
    external?: string;
};

const API_URL = import.meta.env.VITE_API_URL;

type Props = {
    errors: RegisterErrors;
};

export default function Register({ errors: backendErrors }: Props) {
    const {
        data,
        setData,
        post,
        processing,
        errors: formErrors,
        reset,
    } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        try {
            const formBody = new URLSearchParams();
            formBody.append("name", data.name);
            formBody.append("email", data.email);
            formBody.append("password", data.password);

            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formBody.toString(),
            });

            const externalResponse = await response.json();

            if (externalResponse.meta.code != 200) {
                throw new Error(
                    externalResponse.meta.message ||
                        "Gagal register ke API eksternal."
                );
            } else {
                post(route("register"), {
                    onFinish: () => reset("password", "password_confirmation"),
                });
            }
        } catch (error) {}
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

                            {/* Error dari backend */}
                            {backendErrors.external && (
                                <Badge variant={"destructive"}>
                                    {backendErrors.external}
                                </Badge>
                            )}

                            <form onSubmit={submit}>
                                <div>
                                    <Label htmlFor="name">Name</Label>

                                    <Input
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="block mt-1 w-full"
                                        autoComplete="name"
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                        disabled={processing}
                                    />

                                    <InputError
                                        message={formErrors.name}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4">
                                    <Label htmlFor="email">Email</Label>

                                    <Input
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
                                        disabled={processing}
                                    />

                                    <InputError
                                        message={formErrors.email}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4">
                                    <Label htmlFor="password">Password</Label>

                                    <Input
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
                                        disabled={processing}
                                    />

                                    <InputError
                                        message={formErrors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4">
                                    <Label htmlFor="password_confirmation">
                                        Confirm Password
                                    </Label>

                                    <Input
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
                                        disabled={processing}
                                    />

                                    <InputError
                                        message={
                                            formErrors.password_confirmation
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex justify-end items-center mt-4">
                                    <Button
                                        className="ms-4 px-8 py-2"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Registering..."
                                            : "Register"}
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
