'use client'

import { ButtonGreenBorder, ButtonBlack } from "@/components/global/Button";
import React, { useState, useEffect } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { AlertQuestion } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import { TbLockOpen, TbLock, TbPencil } from "react-icons/tb";

interface table {
    tahun: number;
    menu: "ranwal" | "rankhir" | "penetapan";
}

const TableSasaran: React.FC<table> = ({ tahun, menu }) => {

    const [Sasaran, setSasaran] = useState<any[]>([]);
    const [Lock, setLock] = useState<boolean>(false);
    const token = getToken();

    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [LoadingStatus, setLoadingStatus] = useState<boolean | null>(null);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchSasaran = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/sasaran_pemda/${menu}/${tahun}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                if (data == null) {
                    setSasaran([]);
                } else if (result.code == 200 || result.code == 201) {
                    setSasaran(data);
                    setError(false);
                } else {
                    setSasaran([]);
                    setError(true);
                    console.log(data);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchSasaran();
    }, [token, FetchTrigger, tahun, menu]);


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
            <div className="flex flex-col gap-2 mt-2">
                {menu === "penetapan" &&
                    <div className="flex w-full p-2">
                        <div className={`w-full p-2 flex items-start border rounded-lg ${Lock ? "border-red-800 bg-red-300" : "border-emerald-800 bg-emerald-300"}`}>
                            {LoadingStatus ?
                                <div className="flex items-center gap-1">
                                    <LoadingClip />
                                    Loading Status Lock Sasaran Pemda Penetapan
                                </div>
                                :
                                <div className={`flex items-center justify-between w-full gap-1 ${Lock ? "text-red-800" : "text-emerald-800"}`}>
                                    {Lock ?
                                        <>
                                            <div className="flex items-center gap-2">
                                                <p className="p-1 border border-red-800 rounded-full"><TbLock /></p>
                                                <div className="flex flex-col">
                                                    <p className="font-semibold">Sasaran Pemda Penetapan Terkunci</p>
                                                    <p className="text-sm font-light">Tidak bisa mengubah data yang terkunci / Lock</p>
                                                </div>
                                            </div>
                                            <ButtonBlack
                                                className="flex items-center gap-1"
                                                onClick={() => AlertQuestion("Buka Kunci / Unlock ?", "", "question", "Unlock", "Batal").then((result) => {
                                                    if (result.isConfirmed) {
                                                        // handleLock("DELETE");
                                                    }
                                                })}
                                            >
                                                <TbLockOpen />
                                                Unlock
                                            </ButtonBlack>
                                        </>
                                        :
                                        <>
                                            <div className="flex items-center gap-2">
                                                <p className="p-1 border border-emerald-800 rounded-full"><TbLockOpen /></p>
                                                <p>Sasaran Pemda Penetapan Tidak Terkunci</p>
                                            </div>
                                            <ButtonBlack
                                                className="flex items-center gap-1"
                                                onClick={() => AlertQuestion("Kunci / Lock ?", "", "question", "Lock", "Batal").then((result) => {
                                                    if (result.isConfirmed) {
                                                        // handleLock("POST");
                                                    }
                                                })}
                                            >
                                                <TbLock />
                                                Lock
                                            </ButtonBlack>
                                        </>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                }
                <div className="overflow-auto mx-2 mb-2 rounded-t-xl border">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-emerald-500 text-white">
                                <th rowSpan={menu === "ranwal" ? 2 : 3} className="border-r border-b px-6 py-3 min-w-[50px] text-center">No</th>
                                <th rowSpan={menu === "ranwal" ? 2 : 3} className="border-r border-b px-6 py-3 min-w-[300px]">Strategic Pemda</th>
                                <th rowSpan={menu === "ranwal" ? 2 : 3} className="border-r border-b px-6 py-3 min-w-[300px]">Sasaran Pemda</th>
                                <th rowSpan={menu === "ranwal" ? 2 : 3} className="border-r border-b px-6 py-3 min-w-[200px]">Indikator</th>
                                <th rowSpan={menu === "ranwal" ? 2 : 3} className="border-r border-b px-6 py-3 min-w-[300px]">Definisi Operational</th>
                                <th rowSpan={menu === "ranwal" ? 2 : 3} className="border-r border-b px-6 py-3 min-w-[300px]">Rumus Perhitungan</th>
                                <th rowSpan={menu === "ranwal" ? 2 : 3} className="border-r border-b px-6 py-3 min-w-[300px]">Sumber Data</th>
                                <th rowSpan={menu === "ranwal" ? 2 : 3} className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</th>
                                <th colSpan={menu === "ranwal" ? 2 : 4} className="border-l border-b px-6 py-3 min-w-[100px]">{tahun || ""}</th>

                            </tr>
                            {menu != "ranwal" &&
                                <tr className="text-white">
                                    <th colSpan={2} className={`${menu === "rankhir" ? "bg-red-600" : "bg-yellow-600"} border-l border-b px-6 py-1 min-w-[50px]`}>{menu === "rankhir" ? "Ranwal" : "Rankir"}</th>
                                    <th colSpan={2} className={`${menu === "rankhir" ? "bg-yellow-600" : "bg-blue-600"} border-l border-b px-6 py-1 min-w-[50px]`}>{menu === "rankhir" ? "Rankir" : "Penetapan"}</th>
                                </tr>
                            }
                            <tr className="bg-emerald-700 text-white">
                                {menu != "ranwal" &&
                                    <>
                                        <th className="border-l border-b px-6 py-1 min-w-[50px]">Target</th>
                                        <th className="border-l border-b px-6 py-1 min-w-[50px]">Satuan</th>
                                    </>
                                }
                                <th className="border-l border-b px-6 py-1 min-w-[50px]">Target</th>
                                <th className="border-l border-b px-6 py-1 min-w-[50px]">Satuan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Sasaran?.length === 0 ?
                                <tr>
                                    <td className="px-6 py-3" colSpan={30}>
                                        Data Kosong / Belum Ditambahkan
                                    </td>
                                </tr>
                                :
                                Sasaran.map((data: any, index: number) => {

                                    const rs = data?.indikator.length === 0 ? 2 : data.indikator.length + 1;

                                    return (
                                        <React.Fragment key={index}>
                                            {/* Baris Utama */}
                                            <tr>
                                                <td rowSpan={rs} className="border-x border-b border-emerald-500 px-6 py-4 text-center">{index + 1}</td>
                                                <td rowSpan={rs} className="border-r border-b border-emerald-500 px-6 py-4">{data.nama_tematik || "-"}</td>
                                                <td rowSpan={rs} className="border-r border-b border-emerald-500 px-6 py-4">{data.tujuan_pemda || "-"}</td>
                                            </tr>
                                            {data.indikator.length === 0 ?
                                                <tr>
                                                    <td className="border-r border-b border-emerald-500 px-6 py-4 text-red-400" colSpan={9}>tidak ada indikator</td>
                                                </tr>
                                                :
                                                data.indikator.map((i: any, i_index: number) => (
                                                    <tr key={i_index}>
                                                        <td className="border-r border-b border-emerald-500 px-6 py-4">{i.indikator || "-"}</td>
                                                        <td className="border-r border-b border-emerald-500 px-6 py-4">{i.definisi_operasional || "-"}</td>
                                                        <td className="border-r border-b border-emerald-500 px-6 py-4">{i.rumus_perhitungan || "-"}</td>
                                                        <td className="border-r border-b border-emerald-500 px-6 py-4">{i.sumber_data || "-"}</td>
                                                        <td className="border-r border-b border-emerald-500 px-6 py-4">
                                                            <div className="flex flex-col justify-center items-center gap-2">
                                                                <ButtonGreenBorder
                                                                    className={`flex items-center gap-1 w-full ${(menu === "ranwal" || Lock) && "cursor-not-allowed"}`}
                                                                    onClick={() => {
                                                                        if (menu === "rankhir") {
                                                                            if (i.target_rankhir[0].id === 0) {
                                                                                // handleModal(i, "tambah", i.target_ranwal, [])
                                                                            } else {
                                                                                // handleModal(i, "edit", i.target_ranwal, i.target_rankhir)
                                                                            }
                                                                        } else {
                                                                            if (i.target_penetapan[0].id === 0) {
                                                                                // handleModal(i, "tambah", i.target_rankhir, [])
                                                                            } else {
                                                                                // handleModal(i, "edit", i.target_rankhir, i.target_penetapan)
                                                                            }
                                                                        }

                                                                    }}
                                                                    disabled={menu === "ranwal" || Lock}
                                                                >
                                                                    <TbPencil />
                                                                    Edit
                                                                </ButtonGreenBorder>
                                                            </div>
                                                        </td>
                                                        {i.target &&
                                                            i.target.map((t: any, t_index: number) => (
                                                                <React.Fragment key={t_index}>
                                                                    <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">{t.target || "-"}</td>
                                                                    <td className="border-r border-b border-emerald-500 px-6 py-4">{t.satuan || "-"}</td>
                                                                </React.Fragment>
                                                            ))
                                                        }
                                                        {i.target_ranwal &&
                                                            i.target_ranwal.map((t: any, t_index: number) => (
                                                                <React.Fragment key={t_index}>
                                                                    <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">{t.target || "-"}</td>
                                                                    <td className="border-r border-b border-emerald-500 px-6 py-4">{t.satuan || "-"}</td>
                                                                </React.Fragment>
                                                            ))
                                                        }
                                                        {i.target_rankhir &&
                                                            i.target_rankhir.map((t: any, t_index: number) => (
                                                                <React.Fragment key={t_index}>
                                                                    <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">{t.target || "-"}</td>
                                                                    <td className="border-r border-b border-emerald-500 px-6 py-4">{t.satuan || "-"}</td>
                                                                </React.Fragment>
                                                            ))
                                                        }
                                                        {i.target_penetapan &&
                                                            i.target_penetapan.map((t: any, t_index: number) => (
                                                                <React.Fragment key={t_index}>
                                                                    <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">{t.target || "-"}</td>
                                                                    <td className="border-r border-b border-emerald-500 px-6 py-4">{t.satuan || "-"}</td>
                                                                </React.Fragment>
                                                            ))
                                                        }
                                                    </tr>
                                                ))
                                            }
                                        </React.Fragment>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default TableSasaran;
