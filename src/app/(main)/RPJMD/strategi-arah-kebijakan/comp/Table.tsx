'use client'

import React, { useEffect, useState } from "react";
import { StrategiArahKebijakan, IsuStrategisPemda, TujuanPemda, FindallStrategiArahKebijakan, SasaranPemda, ArahKebijakanPemda } from "../type";
import { ButtonRedBorder } from "@/components/global/Button";
import { TbEyeClosed } from "react-icons/tb";
import { useBrandingContext } from "@/context/BrandingContext";
import { getToken } from "@/components/lib/Cookie";
import { AlertNotification } from "@/components/global/Alert";
import { useRouter } from "next/navigation";
import { LoadingClip } from "@/components/global/Loading";
import TableIsu from "./TableIsu";
import TableTujuan from "./TableTujuan";

interface Table {
    tahun_awal: string;
    tahun_akhir: string;
}

const Table: React.FC<Table> = ({ tahun_awal, tahun_akhir }) => {

    const { branding } = useBrandingContext();
    const token = getToken();
    const router = useRouter();

    const [Data, setData] = useState<FindallStrategiArahKebijakan | null>(null);
    const [Loading, setLoading] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);

    useEffect(() => {
        const FetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${branding?.api_perencanaan}/strategi_arah_kebijakan_pemda/${tahun_awal}/${tahun_akhir}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                if (result.code === 200) {
                    setData(result.data);
                } else if (result.code === 401) {
                    AlertNotification("Login Kembali", "", "warning", 2000);
                    router.push('/login');
                } else {
                    AlertNotification("Error", `${result.data || ""}`, "error", 2000);
                }
            } catch (err) {
                console.log(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        FetchData();
    }, [token, tahun_awal, tahun_akhir, branding]);

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 font-bold mx-5 py-5">Error, Periksa koneksi internet atau database server, jika error berlanjut silakan hubungi tim developer</h1>
            </div>
        )
    }

    return (
        <>
            <TableIsu
                Data={Data?.isu_strategis_pemdas || []}
            />
            <TableTujuan
                Data={Data?.tujuan_pemda || []}
            />
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-emerald-500 text-white">
                            <th className="border-r border-b px-6 py-3 text-center">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Tujuan Pemda</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Sasaran Pemda</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Strategi</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Arah Kebijakan</th>
                        </tr>
                        <tr className="bg-emerald-700 text-white">
                            <th className="border-r border-b text-center">1</th>
                            <th className="border-r border-b text-center">2</th>
                            <th className="border-r border-b text-center">3</th>
                            <th className="border-r border-b text-center">4</th>
                            <th className="border-r border-b text-center">5</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Data?.strategi_arah_kebijakan_pemdas.length === 0 ? (
                            <tr>
                                <td className="px-6 py-3" colSpan={30}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                        ) : (
                            Data?.strategi_arah_kebijakan_pemdas.map((item: StrategiArahKebijakan, index: number) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td rowSpan={item.sasaran_pemdas ? item.sasaran_pemdas.length + 1 : 2} className="border-x border-b border-emerald-500 py-4 px-3 text-center">{index + 1}</td>
                                        <td rowSpan={item.sasaran_pemdas ? item.sasaran_pemdas.length + 1 : 2} className="border-r border-b border-emerald-500 px-6 py-4 font-semibold">{item.tujuan_pemda || "-"}</td>
                                    </tr>
                                    {item.sasaran_pemdas ?
                                        item.sasaran_pemdas.map((s: SasaranPemda, s_index: number) => (
                                            <tr key={s_index}>
                                                <td className="border-r border-b border-emerald-500 px-6 py-4">{s.sasaran_pemda || ""}</td>
                                                <td className="border-r border-b border-emerald-500 px-6 py-4">{s.strategi_pemda || ""}</td>
                                                {s.arah_kebijakan_pemdas ?
                                                    <td className="border-r border-b p-2 border-emerald-500">
                                                        <div className="flex flex-col items-center gap-2">
                                                            {s.arah_kebijakan_pemdas.map((ar: ArahKebijakanPemda, ar_index: number) => (
                                                                <p key={ar_index} className="flex flex-col gap-2 p-1 border border-emerald-500 rounded-lg w-full">
                                                                    {ar_index + 1}. {ar.arah_kebijakan_pemda || "-"}
                                                                    <ButtonRedBorder className="flex items-center gap-1 text-sm">
                                                                        <TbEyeClosed /> Sembunyikan
                                                                    </ButtonRedBorder>
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    :
                                                    <td className="border-r border-b border-emerald-500 bg-red-400 px-6 py-4 font-semibold">
                                                        Stategic Pemda belum di buat
                                                    </td>
                                                }
                                            </tr>
                                        ))
                                        :
                                        <td colSpan={3} className="border-r border-b border-emerald-500 px-6 py-4 font-semibold bg-red-300">sasaran pemda belum di buat</td>
                                    }
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Table;
