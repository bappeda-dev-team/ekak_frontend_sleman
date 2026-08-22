'use client'

import React, { useState, useEffect } from "react";
import { getUser, getToken } from "@/components/lib/Cookie";
import Link from "next/link";
import { TbDownload, TbBook2, TbCircleFilled, TbAlertCircle, TbPencil } from "react-icons/tb";
import { ButtonRedBorder, ButtonSky } from "@/components/global/Button";
import { useBrandingContext } from "@/context/BrandingContext";

import { IsLoadingBranding } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";

const Dashboard = () => {
    const { LoadingBranding } = useBrandingContext();

    const [User, setUser] = useState<any>(null);
    const [PasswordShouldUpdate, setPasswordShouldUpdate] = useState(false);

    useEffect(() => {
        const fetchUser = getUser();

        if (!fetchUser?.user) {
            return;
        }

        setUser(fetchUser.user);

        const token = getToken();

        const getUserInfo = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL;

                const response = await fetch(
                    `${API_URL}/user/info?userId=${fetchUser.user.user_id}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const userInfo = await response.json();

                setPasswordShouldUpdate(userInfo.data.password_change_required);
            } catch (err) {
                AlertNotification(
                    "Gagal mengambil informasi user",
                    "Terdapat kesalahan server / koneksi internet",
                    "error",
                    2000
                );

                console.error('Gagal mengambil informasi user:', err);
            }
        };

        getUserInfo();
    }, []);

    const manual_user = process.env.NEXT_PUBLIC_LINK_MANUAL_USER;

    if (LoadingBranding) {
        return <IsLoadingBranding />;
    }

    return (
        <div className="flex flex-col gap-2">

            <div className="p-5 rounded-xl border border-emerald-500">
                <p className="flex items-center gap-1 font-bold">
                    <TbCircleFilled color="green" />
                    Selamat Datang,{" "}
                    {User?.nama_pegawai
                        ? User.nama_pegawai
                        : "di halaman dashboard"}
                </p>

                {User?.roles !== "super_admin" &&
                    User?.roles !== "reviewer" && (
                        <p>
                            {User?.nama_opd
                                ? User.nama_opd
                                : "tidak terdaftar di OPD manapun"}
                        </p>
                    )}
            </div>

            <div className="flex items-center justify-between gap-2 p-5 rounded-xl border border-sky-500">
                <h1 className="flex items-center gap-2">
                    <TbBook2 className="font-bold text-4xl rounded-full p-1 border border-black" />
                    Download Panduan Website (Manual User)
                </h1>

                <Link
                    href={
                        manual_user ||
                        "https://drive.google.com/drive/folders/1xFqVRchn8eCRtMLhWvqSb78qDxTXB9Y1?usp=sharing"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <ButtonSky className="flex items-center gap-2">
                        <TbDownload />
                        Download
                    </ButtonSky>
                </Link>
            </div>

            {PasswordShouldUpdate && (
                <div className="flex items-center justify-between gap-2 p-5 rounded-xl border border-red-400">
                    <h1 className="flex items-center gap-2 text-red-600">
                        <TbAlertCircle className="font-bold text-4xl p-1 animate-pulse" />
                        Disarankan mengganti password default sekarang dengan password baru
                    </h1>

                    <Link href="/edit-password">
                        <ButtonRedBorder className="flex items-center gap-2">
                            <TbPencil />
                            Edit Password
                        </ButtonRedBorder>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
