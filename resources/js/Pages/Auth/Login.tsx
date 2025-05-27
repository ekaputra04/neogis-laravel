import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import image from "@/images/background/sign-in-bg.jpg";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { ThemeProvider } from "@/Components/ui/theme-provider";
import Checkbox from "@/Components/Checkbox";
import { Label } from "@/Components/ui/label";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [apiError, setApiError] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setApiError("");

        try {
            const formBody = new URLSearchParams();
            formBody.append("email", data.email);
            formBody.append("password", data.password);

            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formBody.toString(),
            });

            const externalResponse = await response.json();

            if (externalResponse.meta.code !== 200) {
                throw new Error(
                    externalResponse.meta.message ||
                        "Gagal login ke API eksternal."
                );
            }

            const token = externalResponse.meta.token;
            const expiredInSeconds = externalResponse.meta["token-expired"];
            const expiredAt = new Date(
                Date.now() + expiredInSeconds * 1000
            ).toISOString();

            localStorage.setItem("external_api_token", token);
            localStorage.setItem("external_token_expired_at", expiredAt);

            const checkResponse = await fetch("/api/users/check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify({ email: data.email }),
            });

            const checkData = await checkResponse.json();

            if (!checkData.exists) {
                await fetch("/api/users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    body: JSON.stringify({
                        name: "User",
                        email: data.email,
                        password: data.password,
                    }),
                });
            }

            post(route("login"), {
                onSuccess: () => {
                    reset("password");
                },
                onError: (errors) => {
                    setApiError(
                        errors.email ||
                            errors.password ||
                            "Gagal login ke aplikasi."
                    );
                },
            });
        } catch (error: any) {
            setApiError(error.message || "Terjadi kesalahan saat login.");
        }
    };

    return (
        <>
            <ThemeProvider>
                <Head title="Log in" />

                <div className="flex justify-center items-center w-screen h-screen overflow-y-hidden">
                    <div className="justify-center items-center px-8 md:px-16 lg:px-32 w-full md:w-1/2">
                        <div className="flex flex-col flex-1 space-y-8">
                            <h1 className="font-medium text-2xl">
                                Welcome Back 👋
                            </h1>
                            <p className="text-foreground text-sm">
                                Explore and manage geographic data with ease.
                                Sign in to continue accessing the Geographic
                                Information System.
                            </p>

                            {status && (
                                <div className="mb-4 font-medium text-green-600 text-sm">
                                    {status}
                                </div>
                            )}
                            {apiError && (
                                <div className="mb-4 font-medium text-red-600 text-sm">
                                    {apiError}
                                </div>
                            )}

                            <form className="">
                                <div className="flex flex-col gap-6">
                                    <div className="gap-2 grid">
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
                                        />
                                        <InputError
                                            message={errors.email}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="gap-2 grid">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">
                                                Password
                                            </Label>
                                            <Link
                                                href={route("password.request")}
                                                className="ml-auto text-sm hover:underline underline-offset-2"
                                            >
                                                Forgot your password?
                                            </Link>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="block mt-1 w-full"
                                            autoComplete="current-password"
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.password}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="block mt-4">
                                        <label className="flex items-center">
                                            <Checkbox
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(e) =>
                                                    setData(
                                                        "remember",
                                                        (e.target.checked ||
                                                            false) as false
                                                    )
                                                }
                                            />
                                            <span className="ms-2 text-gray-600 text-sm">
                                                Remember me
                                            </span>
                                        </label>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        onClick={submit}
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Logging in..."
                                            : "Log in"}
                                    </Button>
                                </div>
                            </form>

                            <p className="text-foreground text-sm">
                                Don't have an account?{" "}
                                <Link
                                    className="font-medium text-foreground underline"
                                    href="/register"
                                >
                                    Sign up
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
