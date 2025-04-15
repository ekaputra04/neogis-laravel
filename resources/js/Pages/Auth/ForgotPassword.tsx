import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import image from "@/images/forgot-pw-bg.jpg";
import { Button } from "@/Components/ui/button";
import { ThemeProvider } from "@/Components/ui/theme-provider";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <ThemeProvider>
            <div>
                <Head title="Forgot Password" />

                <div className="flex justify-center items-center w-screen h-screen overflow-y-hidden">
                    <div className="justify-center items-center px-8 md:px-16 lg:px-32 w-full md:w-1/2">
                        <div className="flex flex-col flex-1 gap-2 mx-auto [&>input]:mb-6 w-full min-w-64 max-w-64 text-foreground">
                            <div>
                                <h1 className="mb-4 font-medium text-2xl">
                                    Reset Password
                                </h1>
                                <p className="text-secondary-foreground text-sm">
                                    Already have an account?{" "}
                                    <Link
                                        className="text-primary underline"
                                        href="/login"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>

                            <div className="mt-2 mb-4 text-gray-600 text-sm">
                                Forgot your password? No problem. Just let us
                                know your email address and we will email you a
                                password reset link that will allow you to
                                choose a new one.
                            </div>

                            {status && (
                                <div className="mb-4 font-medium text-green-600 text-sm">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit}>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="block mt-1 w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />

                                <div className="flex justify-center items-center mt-4 w-full">
                                    <Button
                                        className="ms-4 px-8 py-2"
                                        disabled={processing}
                                    >
                                        Email Password Reset Link
                                    </Button>
                                </div>
                            </form>
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
            </div>
        </ThemeProvider>
    );
}
