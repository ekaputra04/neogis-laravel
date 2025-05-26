import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, router } from "@inertiajs/react";
import { FormEventHandler, useEffect, useState } from "react";
import image from "@/images/background/sign-in-bg.jpg";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { ThemeProvider } from "@/Components/ui/theme-provider";
import axios from "axios";
import Cookies from "js-cookie";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Checkbox } from "@/Components/ui/checkbox";

const formSchema = z.object({
    email: z.string().min(2).max(50),
    password: z.string().min(2).max(50),
    remember: z.boolean(),
});

const API_URL = import.meta.env.VITE_API_URL;

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setApiError("");
        setLoading(true);

        try {
            const formBody = new URLSearchParams();
            formBody.append("email", values.email);
            formBody.append("password", values.password);

            const response = await fetch(`${API_URL}/login`, {
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

            const checkResponse = await axios.post("/api/users/check", {
                email: values.email,
            });

            if (!checkResponse.data.exists) {
                await axios.post("/api/users", {
                    name: "User",
                    email: values.email,
                    password: values.password,
                });
            }

            const loginFormData = new FormData();
            loginFormData.append("email", values.email);
            loginFormData.append("password", values.password);
            loginFormData.append("remember", values.remember ? "on" : "");

            await axios.post("/login", loginFormData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "X-Requested-With": "XMLHttpRequest",
                },
            });

            router.visit("/dashboard");
            form.resetField("password");
        } catch (error: any) {
            setApiError(
                error.response?.data?.errors?.email?.[0] ||
                    error.response?.data?.error ||
                    error.response?.data?.meta?.message ||
                    error.message ||
                    "Terjadi kesalahan saat login."
            );
        } finally {
            setLoading(false);
        }
    }

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

                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-4"
                                >
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="m@mail.com"
                                                        {...field}
                                                        disabled={loading}
                                                        type="email"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="********"
                                                        type="password"
                                                        {...field}
                                                        disabled={loading}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="remember"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-transparent">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                        Remember me
                                                    </FormLabel>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        {loading ? "Loading..." : "Login"}
                                    </Button>
                                </form>
                            </Form>

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
