import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import image from "@/images/background/sign-in-bg.jpg";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { ThemeProvider } from "@/Components/ui/theme-provider";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;
const LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL;

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        password_confirmation: "",
        name: "User",
        remember: false as boolean,
    });

    const [apiError, setApiError] = useState<string>("");

    const loginToExternalAPI = async (): Promise<boolean> => {
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
                redirect: "manual",
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API error:", errorText);
                setApiError(`Gagal login ke sistem eksternal: ${errorText}`);
                toast.error(`Gagal login ke sistem eksternal`);
                return false;
            }

            const result = await response.json();
            console.log("LOGIN RESULT", result);

            const token = result.meta?.token;
            if (!token) {
                setApiError("Token tidak ditemukan dalam respons API.");
                toast.error("Token tidak ditemukan.");
                return false;
            }

            localStorage.setItem("external_api_token", token);
            localStorage.setItem(
                "external_token_expired_at",
                new Date(Date.now() + (result.meta["token-expired"] || 3600) * 1000).toISOString()
            );
            return true;
        } catch (error: any) {
            console.error("Error during external API login:", error);
            setApiError(error.message || "Terjadi kesalahan saat login ke API eksternal.");
            toast.error(error.message || "Terjadi kesalahan saat login.");
            return false;
        }
    };

    const checkUserExistInLocal = async (): Promise<boolean> => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
            const response = await fetch(`${LOCAL_API_URL}/user/check`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken || "",
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify({ email: data.email }),
            });

            if (!response.ok) {
                console.error("Check user error:", await response.text());
                return false;
            }

            const responseData = await response.json();

            console.log("CHECK USER RESPONSE", responseData);

            return responseData.exists;
        } catch (error: any) {
            console.error("Error checking user in local:", error);
            setApiError("Gagal memeriksa pengguna di sistem lokal.");
            toast.error("Gagal memeriksa pengguna di sistem lokal.");
            return false;
        }
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setApiError("");

        const isExternalValid = await loginToExternalAPI();
        if (!isExternalValid) {
            return;
        }

        const isUserExist = await checkUserExistInLocal();
        if (!isUserExist) {
            post(route("register"), {
                onSuccess: () => {
                    reset("password", "password_confirmation");
                },
                onError: (errors) => {
                    setApiError(
                        errors.email || errors.password || errors.name || "Gagal mendaftar di sistem lokal."
                    );
                    toast.error("Gagal mendaftar di sistem lokal.");
                },
                onFinish: () => { },
            });
        } else {

            post(route("login"), {
                onSuccess: () => {
                    reset("password");
                },
                onError: (errors) => {
                    setApiError(
                        errors.email || errors.password || "Gagal login ke aplikasi."
                    );
                    toast.error("Gagal login ke aplikasi.");
                },
                onFinish: () => { },
            });
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

                            <form onSubmit={submit}>
                                <div>
                                    <InputLabel htmlFor="email" value="Email" />

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

                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="password"
                                        value="Password"
                                    />

                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="block mt-1 w-full"
                                        autoComplete="current-password"
                                        onChange={(e) => {
                                            setData("password", e.target.value);
                                            setData("password_confirmation", e.target.value);
                                        }
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

                                <div className="flex justify-end items-center mt-4">
                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-gray-600 hover:text-gray-900 text-sm underline"
                                        >
                                            Forgot your password?
                                        </Link>
                                    )}

                                    <Button
                                        className="ms-4 px-8 py-2"
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
