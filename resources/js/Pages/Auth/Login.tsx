import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import image from "@/images/sign-in-bg.jpg";
import { Button } from "@/Components/ui/button";

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
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <div className="flex justify-center items-center w-screen h-screen overflow-y-hidden">
                <div className="justify-center items-center px-8 md:px-16 lg:px-32 w-full md:w-1/2">
                    <div className="flex flex-col flex-1 space-y-8">
                        <h1 className="font-medium text-2xl">
                            Welcome Back 👋
                        </h1>
                        <p className="text-foreground text-sm">
                            Explore and manage geographic data with ease. Sign
                            in to continue accessing the Geographic Information
                            System.
                        </p>

                        {status && (
                            <div className="mb-4 font-medium text-green-600 text-sm">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="email" value="Email" />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="block mt-1 w-full"
                                    autoComplete="username"
                                    isFocused={true}
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

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="block mt-1 w-full"
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
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
                                    Log in
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
        </>
    );
}
