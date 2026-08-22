'use client'

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Select from 'react-select';
import { ButtonGreen, ButtonRed } from "@/components/global/Button";
import { LoadingButtonClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";
import { useRouter } from "next/navigation";
import { TbArrowBack, TbDeviceFloppy, TbEye, TbEyeClosed } from "react-icons/tb";
import { getToken, getUser } from "@/components/lib/Cookie";

interface FormValue {
    password: string;
    confirm_password: string;
}

export const FormEditPassword = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();

    const router = useRouter();

    const [Proses, setProses] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [User, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = getUser();

        if (fetchUser?.user) {
            setUser(fetchUser.user);
        }
    }, []);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        if (data.password !== data.confirm_password) {
            AlertNotification(
                "Gagal",
                "Password dan konfirmasi password tidak sama!",
                "error",
                1400
            );
            return;
        }

        setProses(true);

        try {
            const token = getToken();
            const API_URL = process.env.NEXT_PUBLIC_API_URL;

            const response = await fetch(`${API_URL}/user/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    password: data.password,
                    confirm_password: data.confirm_password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.status || "Gagal mengubah password"
                );
            }

            AlertNotification(
                "Berhasil",
                "Password berhasil diperbarui",
                "success",
                1500
            );

            router.push("/");
        } catch (error) {
            console.error("Gagal mengubah password:", error);

            AlertNotification(
                "Gagal",
                error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan saat mengubah password",
                "error",
                2000
            );
        } finally {
            setProses(false);
        }
    };

    return (
        <div className="border p-5 rounded-xl shadow-xl">
            <h1 className="uppercase font-bold">
                Form Edit Password User
            </h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col mx-5 py-5"
            >
                {/* Nama Pegawai */}
                <div className="flex flex-col py-1">
                    <label
                        htmlFor="nama_pegawai"
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                    >
                        Nama Pegawai
                    </label>

                    <input
                        id="nama_pegawai"
                        type="text"
                        value={User?.nama_pegawai || ""}
                        disabled
                        className="border border-green-600 bg-gray-100 px-4 py-2 rounded-lg text-gray-600 cursor-not-allowed"
                    />
                </div>

                {/* NIP */}
                <div className="flex flex-col py-1">
                    <label
                        htmlFor="nip"
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                    >
                        NIP
                    </label>

                    <input
                        id="nip"
                        type="text"
                        value={User?.nip || ""}
                        disabled
                        className="border border-green-600 bg-gray-100 px-4 py-2 rounded-lg text-gray-600 cursor-not-allowed"
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col py-1">
                    <label
                        htmlFor="email"
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="text"
                        value={User?.email || ""}
                        disabled
                        className="border border-green-600 bg-gray-100 px-4 py-2 rounded-lg text-gray-600 cursor-not-allowed"
                    />
                </div>

                {/* Perangkat Daerah */}
                <div className="flex flex-col py-1">
                    <label
                        htmlFor="nama_opd"
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                    >
                        Perangkat Daerah
                    </label>

                    <input
                        id="nama_opd"
                        type="text"
                        value={User?.nama_opd || ""}
                        disabled
                        className="border border-green-600 bg-gray-100 px-4 py-2 rounded-lg text-gray-600 cursor-not-allowed"
                    />
                </div>

                {/* Roles */}
                <div className="flex flex-col py-1">
                    <label
                        htmlFor="roles"
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                    >
                        Roles
                    </label>

                    <input
                        id="roles"
                        type="text"
                        value={
                            Array.isArray(User?.roles)
                                ? User.roles.join(", ")
                                : User?.roles || "Tidak memiliki role"
                        }
                        disabled
                        className="border border-green-600 bg-gray-100 px-4 py-2 rounded-lg text-gray-600 cursor-not-allowed"
                    />
                </div>

                {/* Password */}
                <div className="flex flex-col py-1">
                    <label
                        htmlFor="password"
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                    >
                        Password Baru
                    </label>

                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: "Password harus terisi",
                            minLength: {
                                value: 8,
                                message: "Password minimal 8 karakter",
                            },
                        }}
                        render={({ field }) => (
                            <>
                                <div className="relative flex items-center">
                                    <input
                                        {...field}
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Masukkan password baru"
                                        disabled={Proses}
                                        className="border px-4 py-2 rounded-lg w-full pr-10"
                                    />

                                    <button
                                        type="button"
                                        disabled={Proses}
                                        className="absolute right-3 text-sm"
                                        onClick={() =>
                                            setShowPassword((value) => !value)
                                        }
                                    >
                                        {showPassword ? (
                                            <TbEye />
                                        ) : (
                                            <TbEyeClosed />
                                        )}
                                    </button>
                                </div>

                                {errors.password ? (
                                    <p className="text-red-500">
                                        {errors.password.message}
                                    </p>
                                ) : (
                                    <p className="text-slate-300 text-xs">
                                        *Password minimal 8 karakter
                                    </p>
                                )}
                            </>
                        )}
                    />
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col py-1">
                    <label
                        htmlFor="confirm_password"
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                    >
                        Konfirmasi Password Baru
                    </label>

                    <Controller
                        name="confirm_password"
                        control={control}
                        rules={{
                            required: "Konfirmasi password harus terisi",
                        }}
                        render={({ field }) => (
                            <>
                                <div className="relative flex items-center">
                                    <input
                                        {...field}
                                        id="confirm_password"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Masukkan ulang password baru"
                                        disabled={Proses}
                                        className="border px-4 py-2 rounded-lg w-full pr-10"
                                    />

                                    <button
                                        type="button"
                                        disabled={Proses}
                                        className="absolute right-3 text-sm"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (value) => !value
                                            )
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <TbEye />
                                        ) : (
                                            <TbEyeClosed />
                                        )}
                                    </button>
                                </div>

                                {errors.confirm_password ? (
                                    <p className="text-red-500">
                                        {errors.confirm_password.message}
                                    </p>
                                ) : (
                                    <p className="text-slate-300 text-xs">
                                        *Konfirmasi password harus terisi
                                    </p>
                                )}
                            </>
                        )}
                    />
                </div>

                {/* Submit */}
                <ButtonGreen
                    type="submit"
                    className="mt-4 mb-2"
                    disabled={Proses}
                >
                    {Proses ? (
                        <span className="flex items-center gap-1">
                            <LoadingButtonClip />
                            Menyimpan...
                        </span>
                    ) : (
                        <span className="flex items-center gap-1">
                            <TbDeviceFloppy />
                            Simpan
                        </span>
                    )}
                </ButtonGreen>

                <ButtonRed
                    type="button"
                    halaman_url="/"
                    className="flex items-center gap-1"
                    disabled={Proses}
                >
                    <TbArrowBack />
                    Kembali
                </ButtonRed>
            </form>
        </div>
    );
};
