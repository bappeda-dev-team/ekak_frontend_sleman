'use client'

import { ButtonRed, ButtonGreen, ButtonSky } from "@/components/global/Button";
import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { TahunNull } from "@/components/global/OpdTahunNull";
import { getToken } from "@/components/lib/Cookie";
import { TbPencil, TbTrash, TbCirclePlus, TbArrowBadgeDownFilled, TbX } from "react-icons/tb";
import { useBrandingContext } from "@/context/BrandingContext";

interface Target {
    id: string;
    target: string;
    satuan: string;
    tahun: string;
}

interface Indikator {
    id: string;
    indikator: string;
    definisi_operational: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: Target[];
}

interface tujuan {
    pokin_id: number;
    nama_tematik: string;
    jenis_pohon: string;
    level_pohon: number;
    keterangan: string;
    tahun_pokin: string;
    is_active: boolean;
    tujuan_pemda: TujuanPemda[];
}
interface TujuanPemda {
    id: number;
    tujuan_pemda: string;
    visi: string;
    misi: string;
    indikator: Indikator[];
}

interface table {
    tahun: number;
    menu: "ranwal" | "rankhir" | "penetapan";
}

const TableTujuan: React.FC<table> = ({ tahun, menu }) => {

    const { branding } = useBrandingContext();
    const [Tujuan, setTujuan] = useState<tujuan[]>([]);

    const [PeriodeNotFound, setPeriodeNotFound] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);

    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const token = getToken();

    // useEffect(() => {
    //     const API_URL = process.env.NEXT_PUBLIC_API_URL;
    //     const fetchTujuanPemda = async () => {
    //         setLoading(true)
    //         try {
    //             const response = await fetch(`${API_URL}/tujuan_pemda/findall_with_pokin/${tahun_awal}/${tahun_akhir}/${jenis}`, {
    //                 headers: {
    //                     Authorization: `${token}`,
    //                     'Content-Type': 'application/json',
    //                 },
    //             });
    //             const result = await response.json();
    //             const data = result.data;
    //             if (data.length == 0) {
    //                 setDataNull(true);
    //                 setTujuan([]);
    //             } else if (result.code == 500) {
    //                 setPeriodeNotFound(true);
    //                 setTujuan([]);
    //             } else if (result.code == 200 || result.code == 201) {
    //                 setDataNull(false);
    //                 setTujuan(data);
    //                 setError(false);
    //             } else {
    //                 setDataNull(false);
    //                 setTujuan([]);
    //                 setError(true);
    //                 console.log(data);
    //             }
    //         } catch (err) {
    //             setError(true);
    //             console.error(err)
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    //     if (User?.roles !== undefined) {
    //         fetchTujuanPemda();
    //     }
    // }, [token, User, FetchTrigger, tahun, menu]);

    // const hapusTujuanPemda = async (id: number) => {
    //     const API_URL = process.env.NEXT_PUBLIC_API_URL;
    //     // console.log(id);
    //     try {
    //         const response = await fetch(`${API_URL}/tujuan_pemda/delete/${id}`, {
    //             method: "DELETE",
    //             headers: {
    //                 Authorization: `${token}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         })
    //         if (!response.ok) {
    //             alert("response !ok saat hapus data tujuan pemda")
    //         }
    //         AlertNotification("Berhasil", "Data Tujuan Pemda Berhasil Dihapus", "success", 1000);
    //         setFetchTrigger((prev) => !prev);
    //     } catch (err) {
    //         AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
    //         console.error(err);
    //     }
    // };

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
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-emerald-500 text-white">
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px] text-center">No</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Tema</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Tujuan Pemda</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Visi</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Indikator</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Definisi Operational</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Rumus Perhitungan</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Sumber Data</th>
                            <th colSpan={2} className="border-l border-b px-6 py-3 min-w-[100px]">{tahun || ""}</th>

                        </tr>
                        <tr className="bg-emerald-500 text-white">
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Tujuan?.length === 0 ?
                            <tr>
                                <td className="px-6 py-3" colSpan={30}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                            :
                            Tujuan.map((data: tujuan, index: number) => {
                                // Cek apakah data.tujuan_pemda ada
                                const hasTujuanPemda = data.tujuan_pemda.length != 0;
                                const TotalRow = data.tujuan_pemda.reduce((total, item) => total + (item.indikator == null ? 1 : item.indikator.length), 0) + data.tujuan_pemda.length + 1;

                                return (
                                    <React.Fragment key={index}>
                                        {/* Baris Utama */}
                                        <tr>
                                            <td className="border-x border-b border-emerald-500 px-6 py-4 text-center" rowSpan={data.tujuan_pemda.length === 0 ? 2 : TotalRow}>
                                                {index + 1}
                                            </td>
                                            <td className="border-r border-b border-emerald-500 px-6 py-4" rowSpan={data.tujuan_pemda.length === 0 ? 2 : TotalRow}>
                                                <div className="flex flex-col gap-2">
                                                    {data.nama_tematik || "-"} - {data.tahun_pokin}
                                                    <div className="flex items center gap-1 border-t border-emerald-500 pt-3">
                                                        <div className="flex flex-col justify-between  gap-2 h-full w-full">
                                                            {data.is_active === false ?
                                                                <button
                                                                    className="flex justify-between gap-1 rounded-full p-1 bg-red-500 text-white cursor-not-allowed"
                                                                    // onClick={() => handleModalNewTujuan(data.pokin_id)}
                                                                    disabled
                                                                >
                                                                    <div className="flex gap-1">
                                                                        <TbX />
                                                                        <p className="text-xs">Tematik NON-AKTIF</p>
                                                                    </div>
                                                                    <TbArrowBadgeDownFilled className="-rotate-90" />
                                                                </button>
                                                                :
                                                                <button
                                                                    className="flex justify-between gap-1 rounded-full p-1 bg-sky-500 text-white border border-sky-500 hover:bg-white hover:text-sky-500 hover:border hover:border-sky-500"
                                                                // onClick={() => handleModalNewTujuan(data.pokin_id)}
                                                                >
                                                                    <div className="flex gap-1">
                                                                        <TbCirclePlus />
                                                                        <p className="text-xs">Tambah Tujuan Baru</p>
                                                                    </div>
                                                                    <TbArrowBadgeDownFilled className="-rotate-90" />
                                                                </button>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        {hasTujuanPemda ?
                                            data.tujuan_pemda.map((item: TujuanPemda) => (
                                                <React.Fragment key={item.id}>
                                                    <tr>
                                                        <td className="border-x border-b border-emerald-500 px-6 py-6 h-[150px]" rowSpan={item.indikator !== null ? item.indikator.length + 1 : 2}>
                                                            {item.tujuan_pemda || "-"}
                                                        </td>
                                                        <td className="border-x border-b border-emerald-500 px-6 py-6 h-[150px]" rowSpan={item.indikator !== null ? item.indikator.length + 1 : 2}>
                                                            {item.visi || "-"}
                                                            /
                                                            {item.misi || "-"}
                                                        </td>
                                                        <td className="border-x border-b border-emerald-500 px-6 py-6" rowSpan={item.indikator !== null ? item.indikator.length + 1 : 2}>
                                                            <div className="flex flex-col justify-center items-center gap-2">
                                                                <ButtonGreen
                                                                    className="flex items-center gap-1 w-full"
                                                                // onClick={() => handleModalEditTujuan(item.id, data.pokin_id)}
                                                                >
                                                                    <TbPencil />
                                                                    Edit
                                                                </ButtonGreen>
                                                                <ButtonRed className="flex items-center gap-1 w-full" onClick={() => {
                                                                    AlertQuestion("Hapus?", "Hapus Tujuan Pemda yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                                        if (result.isConfirmed) {
                                                                            // hapusTujuanPemda(item.id);
                                                                        }
                                                                    });
                                                                }}>
                                                                    <TbTrash />
                                                                    Hapus
                                                                </ButtonRed>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {/* INDIKATOR */}
                                                    {item.indikator === null ? (
                                                        <React.Fragment>
                                                            <tr>
                                                                <td colSpan={30} className="border-x border-b border-emerald-500 px-6 py-6 bg-yellow-500 text-white">indikator tujuan pemda belum di tambahkan</td>
                                                            </tr>
                                                        </React.Fragment>
                                                    ) : (
                                                        item.indikator.map((i: Indikator) => (
                                                            <tr key={i.id}>
                                                                <td className="border-x border-b border-emerald-500 px-6 py-6">{i.indikator || "-"}</td>
                                                                <td className="border-x border-b border-emerald-500 px-6 py-6">{i.definisi_operational || "-"}</td>
                                                                <td className="border-x border-b border-emerald-500 px-6 py-6">{i.rumus_perhitungan || "-"}</td>
                                                                <td className="border-x border-b border-emerald-500 px-6 py-6">{i.sumber_data || "-"}</td>
                                                                {i.target.map((t: Target) => (
                                                                    <React.Fragment key={t.id}>
                                                                        <td className="border-x border-b border-emerald-500 px-6 py-6 text-center">{t.target || "-"}</td>
                                                                        <td className="border-x border-b border-emerald-500 px-6 py-6 text-center">{t.satuan || "-"}</td>
                                                                    </React.Fragment>
                                                                ))}
                                                            </tr>
                                                        ))
                                                    )}
                                                </React.Fragment>
                                            ))
                                            :
                                            <td className="border-r border-b border-emerald-500 px-6 py-4 bg-red-400 text-white" colSpan={30}>
                                                Tujuan Pemda belum di buat
                                            </td>
                                        }
                                    </React.Fragment>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default TableTujuan;
