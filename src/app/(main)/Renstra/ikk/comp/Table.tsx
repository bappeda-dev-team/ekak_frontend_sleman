'use client'

import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { OpdNull, TahunNull } from "@/components/global/OpdTahunNull";
import { getToken } from "@/components/lib/Cookie";
import { useBrandingContext } from "@/context/BrandingContext";
import { ButtonSkyBorder, ButtonBlackBorder, ButtonGreenBorder, ButtonRedBorder } from "@/components/global/Button";
import { TbCirclePlus, TbRefresh } from "react-icons/tb";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { TbTrash, TbPencil } from "react-icons/tb";

interface Table {
    kode_opd: string;
}

interface IKK {
    id: number;
    kode_bidang_urusan: string;
    nama_bidang_urusan: string;
    nama_opd: string;
    jenis: "output" | string;
    indikators: Indikator[];
    keterangan: string;
    created_at: string;
    updated_at: string;
}
interface Indikator {
    indikator: string;
    targets: Target[];
}
interface Target {
    target: string;
    satuan: string;
}

const Table: React.FC<Table> = ({ kode_opd }) => {

    const [Data, setData] = useState<IKK[]>([]);
    const [Error, setError] = useState<boolean | null>(null);

    const [Jenis, setJenis] = useState<number>(5);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const [Loading, setLoading] = useState<boolean | null>(null);
    const token = getToken();
    const { branding } = useBrandingContext();

    useEffect(() => {
        const fetchOpd = async () => {
            setLoading(true);
            setError(false);
            try {
                const response = await fetch(`${branding?.api_perencanaan}/ikk/findpokin/${Jenis}/${kode_opd}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                if (result.code === 200) {
                    if (result.data === null) {
                        setData([]);
                    } else {
                        setData(result.data.ikks);
                    }
                } else {
                    setError(true);
                    setData([]);
                }
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        if (kode_opd != undefined) {
            fetchOpd();
        }
    }, [token, Jenis, kode_opd, FetchTrigger]);

    const refresh = () => {
        setFetchTrigger((prev) => !prev);
    }
    const handleJenis = () => {
        if (Jenis === 5) {
            setJenis(6);
        } else {
            setJenis(5);
        }
    }

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 font-bold mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else if (branding?.tahun?.value === undefined) {
        return <TahunNull />
    } else if (branding?.user?.roles == "super_admin" && (branding?.opd?.value === null || branding?.opd?.value === undefined)) {
        return <OpdNull />
    } else {
        return (
            <>
                <div className="flex flex-wrap items-center justify-between gap-1 px-1">
                    <div className="flex items-center gap-1">
                        <button
                            className={`border border-sky-600 rounded-lg px-2 py-1 ${Jenis === 5 ? 'bg-sky-500 text-white' : 'text-sky-600'}`}
                            type="button"
                            onClick={handleJenis}
                        >
                            Outcome (tactical)
                        </button>
                        <button
                            className={`border border-green-600 rounded-lg px-2 py-1 ${Jenis === 6 ? 'bg-green-500 text-white' : 'text-green-600'}`}
                            type="button"
                            onClick={handleJenis}
                        >
                            Output (operational)
                        </button>
                    </div>
                    <div className="flex items-center gap-1">
                        <ButtonBlackBorder
                            className="flex items-center gap-1"
                            onClick={refresh}
                        >
                            <TbRefresh />
                            Refresh
                        </ButtonBlackBorder>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-1 w-full">
                    <div className="overflow-auto m-2 rounded-t-xl border w-full">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-emerald-500 text-white">
                                    <th className="border-r border-b px-6 py-3 text-center">No</th>
                                    <th className="border-r border-b px-6 py-3 min-w-[250px]">Bidang Urusan</th>
                                    <th className="border-r border-b px-6 py-3 w-[100px]">Jenis</th>
                                    <th className="border-r border-b px-6 py-3 w-[300px]">Indikator</th>
                                    <th className="border-l border-b px-6 py-3 w-[200px]">Target</th>
                                    <th className="border-l border-b px-6 py-3 w-[200px]">Satuan</th>
                                    <th className="border-l border-b px-6 py-3 w-[200px]">Keterangan</th>
                                </tr>
                                <tr className="bg-emerald-700 text-white">
                                    <th className="border-r border-b px-2 py-1 text-center">1</th>
                                    <th className="border-r border-b px-2 py-1 text-center">2</th>
                                    <th className="border-r border-b px-2 py-1 text-center">3</th>
                                    <th className="border-r border-b px-2 py-1 text-center">4</th>
                                    <th className="border-l border-b px-2 py-1 text-center">5</th>
                                    <th className="border-l border-b px-2 py-1 text-center">6</th>
                                    <th className="border-l border-b px-2 py-1 text-center">7</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Data.length === 0 ?
                                    <tr>
                                        <td className="px-6 py-3" colSpan={30}>
                                            Data Kosong / Belum Ditambahkan
                                        </td>
                                    </tr>
                                    :
                                    Data.map((item: IKK, index: number) => (
                                        <tr key={index}>
                                            <td className="border border-emerald-500 px-4 py-4 text-center">{index + 1}</td>
                                            <td className="border-x border-b border-emerald-500 px-6 py-4">({item.kode_bidang_urusan || "no code"}) {item.nama_bidang_urusan || "nama bidang urusan tidak diketahui"}</td>
                                            <td className="border-x border-b border-emerald-500 px-6 py-4">{item.jenis || ""}</td>
                                            <td className="border-x border-b border-emerald-500 px-6 py-4">{item.indikators[0].indikator || ""}</td>
                                            <td className="border-x border-b border-emerald-500 px-6 py-4">{item.indikators[0].targets[0].target || ""}</td>
                                            <td className="border-x border-b border-emerald-500 px-6 py-4 text-center">{item.indikators[0].targets[0].satuan || ""}</td>
                                            <td className="border-x border-b border-emerald-500 px-6 py-4">{item.keterangan || ""}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        )
    }
}

export default Table;