'use client'

import React, { useState, useEffect } from "react";
import { getUser } from "@/components/lib/Cookie";
import Link from "next/link";
import { TbDownload, TbBook2, TbCircleFilled, TbAlertCircle, TbPencil } from "react-icons/tb";
import { ButtonRedBorder, ButtonSky } from "@/components/global/Button";
import { useBrandingContext } from "@/context/BrandingContext";

import { IsLoadingBranding } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";

const Dashboard = () => {

  const { LoadingBranding } = useBrandingContext();
  const [User, setUser] = useState<any>(null);
  const [PassChange, setPassChange] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = getUser();
    if (fetchUser) {
      setUser(fetchUser.user);
    }
  }, []);

  const manual_user = process.env.NEXT_PUBLIC_LINK_MANUAL_USER;

  if (LoadingBranding) {
    return (
      <IsLoadingBranding />
    )
  } else {
    return (
      <div className="flex flex-col gap-2">
        <div className="p-5 rounded-xl border border-emerald-500">
          <p className="flex items-center gap-1 font-bold">
            <TbCircleFilled color="green" />
            Selamat Datang, {User?.nama_pegawai ? User?.nama_pegawai : 'di halaman dashboard'}
          </p>
          {(User?.roles != "super_admin" && User?.roles != "reviewer") &&
            <p>
              {User?.nama_opd ? User?.nama_opd : 'tidak terdaftar di OPD manapun'}
            </p>
          }
        </div>
        <div className="flex items-center justify-between gap-2 p-5 rounded-xl border border-sky-500">
          <h1 className="flex items-center gap-2">
            <TbBook2 className="font-bold text-4xl rounded-full p-1 border border-black" />
            Download Panduan Website (Manual User)
          </h1>
          <Link
            href={manual_user || "https://drive.google.com/drive/folders/1xFqVRchn8eCRtMLhWvqSb78qDxTXB9Y1?usp=sharing"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ButtonSky className="flex items-center gap-2">
              <TbDownload />
              Download
            </ButtonSky>
          </Link>
        </div>
        {PassChange &&
          <div className="flex items-center justify-between gap-2 p-5 rounded-xl border border-red-400">
            <h1 className="flex items-center gap-2 text-red-600">
              <TbAlertCircle className="font-bold text-4xl p-1 animate-pulse" />
              Disarankan mengganti password default sekarang dengan password baru
            </h1>
            <Link href="/edit-password">
              <ButtonRedBorder
                onClick={() =>
                  AlertNotification(
                    "Maintenance",
                    "fitur ganti password sedang dalam perbaikan, anda bisa mengganti password default setelah fitur tersedia",
                    "info",
                    5000,
                    true
                  )
                }
                className="flex items-center gap-2"
              >
                <TbPencil />
                Edit
              </ButtonRedBorder>
            </Link>
          </div>
        }
      </div>
    )
  }
}

export default Dashboard;