'use client'

import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TbEye, TbEyeClosed, TbRefresh } from "react-icons/tb";
import { ButtonSky } from "@/components/global/Button";
import { LoadingButtonClip } from "@/components/global/Loading";
import { login } from "@/components/lib/Cookie";
import { useBrandingContext } from "@/context/BrandingContext";
import { AlertNotification } from "@/components/global/Alert";

interface FormValues {
    username: string;
    password: string;
    captcha_key: string;
    captcha_answer: string;
}

interface CaptchaData {
    captcha_id: string;
    captcha_image: string;
}

const LOGIN_LOCK_KEY = "login_locked_until";

const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const [showPassword, setShowPassword] = useState(false);
    const [Proses, setProses] = useState(false);

    const [Captcha, setCaptcha] = useState<CaptchaData | null>(null);
    const [Loading, setLoading] = useState(false);
    const [FetchCaptcha, setFetchCaptcha] = useState(false);
    const [ErrorCaptcha, setErrorCaptcha] = useState(false);

    const [TimeLeft, setTimeLeft] = useState(0);

    const router = useRouter();
    const { branding } = useBrandingContext();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (TimeLeft > 0 || Proses) {
            return;
        }

        setProses(true);

        try {
            const result = await login(
                data.username,
                data.password,
                Captcha?.captcha_id ?? "",
                data.captcha_answer
            );

            if (result.success) {
                localStorage.removeItem(LOGIN_LOCK_KEY);

                router.push("/");
                return;
            }

            setFetchCaptcha((prev) => !prev);

            if (result.isLocked && result.remainingTime > 0) {
                const lockedUntil = new Date(
                    Date.now() + result.remainingTime * 1000
                ).toISOString();

                localStorage.setItem(
                    LOGIN_LOCK_KEY,
                    lockedUntil
                );

                setTimeLeft(result.remainingTime);

                AlertNotification(
                    "Akun Dikunci",
                    result.message ??
                    "Terlalu banyak percobaan login gagal",
                    "error",
                    3000
                );

                return;
            }

            AlertNotification(
                "Login Gagal",
                result.message ?? "NIP atau password salah",
                "error",
                1500
            );
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setProses(false);
        }
    };


    // login lock timer
    useEffect(() => {
        const lockedUntil = localStorage.getItem(LOGIN_LOCK_KEY);

        if (!lockedUntil) {
            return;
        }

        const remainingTime = Math.max(
            0,
            Math.ceil(
                (new Date(lockedUntil).getTime() - Date.now()) / 1000
            )
        );

        if (remainingTime > 0) {
            setTimeLeft(remainingTime);
        } else {
            localStorage.removeItem(LOGIN_LOCK_KEY);
        }
    }, []);

    /**
     * Fetch CAPTCHA
     */
    useEffect(() => {
        const fetchCaptcha = async () => {
            setLoading(true);

            try {
                const response = await fetch(
                    `${branding?.api_perencanaan}/user/captcha`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const result = await response.json();

                if (result.code === 200) {
                    setCaptcha(result.data);
                    setErrorCaptcha(false);
                } else {
                    setCaptcha(null);
                    setErrorCaptcha(true);
                }
            } catch (err) {
                console.error("Captcha error:", err);
                setCaptcha(null);
                setErrorCaptcha(true);
            } finally {
                setLoading(false);
            }
        };

        if (branding?.api_perencanaan) {
            fetchCaptcha();
        }
    }, [FetchCaptcha, branding?.api_perencanaan]);

    /**
     * Countdown login lock
     */
    useEffect(() => {
        if (TimeLeft <= 0) {
            localStorage.removeItem(LOGIN_LOCK_KEY);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [TimeLeft]);

    const minutes = Math.floor(TimeLeft / 60);
    const seconds = TimeLeft % 60;

    const TimerText = `${String(minutes).padStart(2, "0")}:${String(
        seconds
    ).padStart(2, "0")}`;

    return (
        <div className="flex items-center justify-center w-full h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-lg shadow-md w-96"
            >
                {/* Branding */}
                <div className="flex flex-col items-center">
                    <Image
                        src={branding.logo}
                        alt="logo"
                        width={90}
                        height={90}
                    />

                    <h1 className="text-2xl font-bold mt-3 text-center uppercase">
                        {branding.title}
                    </h1>

                    <h1 className="text-lg font-thin mb-6 text-center">
                        {branding.client}
                    </h1>
                </div>

                {/* NIP */}
                <div className="mb-4">
                    <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        NIP
                    </label>

                    <input
                        type="text"
                        id="username"
                        disabled={Proses || TimeLeft > 0}
                        {...register("username", {
                            required: "NIP harus terisi",
                        })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />

                    {errors.username && (
                        <span className="text-red-500 text-sm">
                            {errors.username.message}
                        </span>
                    )}
                </div>

                {/* Password */}
                <div className="mb-6">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Password
                    </label>

                    <div className="relative flex items-center">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            disabled={Proses || TimeLeft > 0}
                            {...register("password", {
                                required: "Password harus terisi",
                            })}
                            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />

                        <button
                            type="button"
                            disabled={Proses || TimeLeft > 0}
                            className="absolute right-3 mt-1 text-sm disabled:cursor-not-allowed"
                            onClick={() =>
                                setShowPassword((prev) => !prev)
                            }
                        >
                            {showPassword ? <TbEye /> : <TbEyeClosed />}
                        </button>
                    </div>

                    {errors.password && (
                        <span className="text-red-500 text-sm">
                            {errors.password.message}
                        </span>
                    )}
                </div>

                {/* CAPTCHA */}
                {Loading ? (
                    <p>Loading captcha...</p>
                ) : ErrorCaptcha ? (
                    <h1 className="text-red-500">
                        Error saat mendapatkan gambar captcha.
                        Cek koneksi internet atau server.
                    </h1>
                ) : (
                    <div className="flex flex-col items-center gap-1">
                        <Image
                            src={Captcha?.captcha_image ?? ""}
                            width={180}
                            height={70}
                            alt="Captcha"
                        />

                        <div className="mb-4 w-full">
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    id="captcha_answer"
                                    placeholder="Masukkan kode di atas"
                                    disabled={Proses || TimeLeft > 0}
                                    {...register("captcha_answer", {
                                        required:
                                            "Captcha harus terisi",
                                    })}
                                    className="block w-full px-3 py-2 border text-center border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />

                                <button
                                    type="button"
                                    disabled={Proses || TimeLeft > 0}
                                    className="text-blue-500 italic text-sm font-light border p-3 rounded-lg hover:bg-blue-200 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() =>
                                        setFetchCaptcha((prev) => !prev)
                                    }
                                >
                                    <TbRefresh />
                                </button>
                            </div>

                            {errors.captcha_answer && (
                                <span className="text-red-500 text-sm">
                                    {errors.captcha_answer.message}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Login Button */}
                <ButtonSky
                    type="submit"
                    className="w-full"
                    disabled={Proses || TimeLeft > 0}
                >
                    {Proses ? (
                        <span className="flex items-center justify-center gap-1">
                            <LoadingButtonClip />
                            Login...
                        </span>
                    ) : (
                        "Login"
                    )}
                </ButtonSky>

                {/* Login Cooldown */}
                {TimeLeft > 0 && (
                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-center">
                        <p className="text-sm font-medium text-red-600">
                            Terlalu banyak percobaan login
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                            Silakan coba lagi dalam
                        </p>

                        <p className="mt-1 text-2xl font-bold text-red-600">
                            {TimerText}
                        </p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default LoginPage;
