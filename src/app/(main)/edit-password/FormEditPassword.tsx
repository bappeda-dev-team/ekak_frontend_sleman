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

    const [Proses, setProses] = useState<boolean>(false);
    const router = useRouter();
    const token = getToken();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [User, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
    }, []);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formData = {
            //key : value
            password: data.password,
            confirm_password: data.confirm_password
        };
        if (data.password === data.confirm_password) {
            alert("dalam pengembangan");
            console.log(formData);
        } else {
            AlertNotification("Password tidak sama", "passowrd harus sama dengan konfirmasi password", "warning", 2000);
        }
        // try {
        //     setProses(true);
        //     const response = await fetch(`${API_URL}/user/create`, {
        //         method: "POST",
        //         headers: {
        //             Authorization: `${token}`,
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(formData),
        //     });
        //     const data = await response.json();
        //     if (data.code === 201 || data.code === 200) {
        //         AlertNotification("Berhasil", "Berhasil menambahkan data user", "success", 1000);
        //         router.push("/useropd");
        //     } else if (data.code === 400) {
        //         AlertNotification("Gagal", `${data.data}`, "error", 3000, true);
        //     } else {
        //         AlertNotification("Gagal", `${data.data}`, "error", 3000, true);
        //     }
        // } catch (err) {
        //     AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        // } finally {
        //     setProses(false);
        // }
    };

    return (
        <>
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Password User :</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >

                    <div className="flex flex-col py-1">
                        <label className="uppercase text-xs font-bold text-gray-700 my-2">
                            Nama & NIP :
                        </label>
                        <div className="flex flex-col gap-1">
                            <div className="border border-green-600 px-4 py-2 rounded-lg flex-1">
                                {User?.nama_pegawai || "unknown"}
                            </div>
                            <div className="border border-green-600 px-4 py-2 rounded-lg flex-1">
                                {User?.nip || "unknown"}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col py-1">
                        <label className="uppercase text-xs font-bold text-gray-700 my-2">
                            Perangkat Daerah :
                        </label>
                        <div className="border border-green-600 px-4 py-2 rounded-lg flex-1">
                            {User?.nama_opd || "unknown"}
                        </div>
                    </div>
                    <div className="flex flex-col py-1">
                        <label className="uppercase text-xs font-bold text-gray-700 my-2">
                            Roles :
                        </label>
                        <div className="border border-green-600 px-4 py-2 rounded-lg flex-1">
                            {User?.roles || "tidak memiliki role"}
                        </div>
                    </div>
                    <div className="flex flex-col py-1">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="password"
                        >
                            Password:
                        </label>
                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: "Password harus terisi" }}
                            render={({ field }) => {
                                return (
                                    <>
                                        <div className="flex items-center">
                                            <input
                                                {...field}
                                                className="border px-4 py-2 rounded-lg flex-1"
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Masukkan Password"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-20 text-sm"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <TbEye /> : <TbEyeClosed />}
                                            </button>
                                        </div>
                                        {errors.password ? (
                                            <h1 className="text-red-500">{errors.password.message}</h1>
                                        ) : (
                                            <h1 className="text-slate-300 text-xs">*Password Harus Terisi</h1>
                                        )}
                                    </>
                                );
                            }}
                        />
                    </div>
                    <div className="flex flex-col py-1">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="confirm_password"
                        >
                            Konfirmasi Password:
                        </label>
                        <Controller
                            name="confirm_password"
                            control={control}
                            rules={{ required: "Konfirmasi Password harus terisi" }}
                            render={({ field }) => {
                                return (
                                    <>
                                        <div className="flex items-center">
                                            <input
                                                {...field}
                                                className="border px-4 py-2 rounded-lg flex-1"
                                                id="password"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Masukkan Konfirmasi Password"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-20 text-sm"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <TbEye /> : <TbEyeClosed />}
                                            </button>
                                        </div>
                                        {errors.confirm_password ? (
                                            <h1 className="text-red-500">{errors.confirm_password.message}</h1>
                                        ) : (
                                            <h1 className="text-slate-300 text-xs">*Konfirmasi Password Harus Terisi</h1>
                                        )}
                                    </>
                                );
                            }}
                        />
                    </div>
                    <ButtonGreen
                        type="submit"
                        className="mt-4 mb-2"
                        disabled={Proses}
                    >
                        {Proses ?
                            <span className="flex items-center gap-1">
                                <LoadingButtonClip />
                                Menyimpan...
                            </span>
                            :
                            <span className="flex items-center gap-1">
                                <TbDeviceFloppy />
                                Simpan
                            </span>
                        }
                    </ButtonGreen>
                    <ButtonRed type="button" halaman_url="/" className="flex items-center gap-1">
                        <TbArrowBack />
                        Kembali
                    </ButtonRed>
                </form>
            </div>
        </>
    )
}