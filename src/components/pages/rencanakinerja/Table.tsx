'use client'

import { ButtonGreenBorder, ButtonRedBorder, ButtonSkyBorder, ButtonBlackBorder } from "@/components/global/Button";
import React, { useState, useEffect } from "react";
import { getUser, getToken } from "@/components/lib/Cookie";
import { TbCirclePlus, TbFileDescription, TbLayersSelected, TbPencil, TbPencilDown, TbTrash } from "react-icons/tb";
import { LoadingSync } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { ModalRencanaKinerja } from "./ModalRencanaKinerja";
import { ModalCloneRekin } from "./ModalCloneRekin";
import { useBrandingContext } from "@/context/BrandingContext";
import { RolePill } from "@/components/global/RolePill";

interface type_rekin {
    id_rencana_kinerja: string;
    id_pohon: number;
    nama_pohon: string;
    nama_rencana_kinerja: string;
    tahun: string;
    status_rencana_kinerja: string;
    catatan: string;
    operasional_daerah: opd;
    pegawai_id: string;
    nama_pegawai: string;
    indikator: indikator[];
}
interface indikator {
    id_indikator: string,
    rencana_kinerja_id: string,
    nama_indikator: string,
    targets: target[]
}
interface target {
    id_target: string;
    indikator_id: string;
    target: string;
    satuan: string;
}
interface opd {
    kode_opd: string;
    nama_opd: string;
}

export const TablePerencanaan = () => {

    const [User, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [rekin, setRekin] = useState<type_rekin[]>([]);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);

    const [ModalNew, setModalNew] = useState<boolean>(false);
    const [ModalEdit, setModalEdit] = useState<boolean>(false);
    const [IdRekin, setIdRekin] = useState<string | null>(null);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const [ModalCloneOpen, setModalCloneOpen] = useState<boolean>(false);
    const [DataModalClone, setDataModalClone] = useState<type_rekin | null>(null);

    const { branding } = useBrandingContext();
    const token = getToken();

    useEffect(() => {
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
    }, []);

    useEffect(() => {
        const fetchRekin = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${branding?.api_perencanaan}/get_rencana_kinerja/pegawai/${User?.nip}?tahun=${branding?.tahun?.value}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.rencana_kinerja;
                if (data == null) {
                    setDataNull(true);
                    setRekin([]);
                } else {
                    setDataNull(false);
                    setRekin(data);
                }
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        if (User?.pegawai_id != undefined) {
            fetchRekin();
        }
    }, [branding, User, token, FetchTrigger]);

    const handleEditRekin = (id: string) => {
        if (ModalEdit) {
            setIdRekin(null);
            setModalEdit(false);
        } else {
            setIdRekin(id);
            setModalEdit(true);
        }
    }

    const handleCloneRekin = (data: type_rekin | null) => {
        if (ModalCloneOpen) {
            setDataModalClone(null);
            setModalCloneOpen(false);
        } else {
            setDataModalClone(data);
            setModalCloneOpen(true);
        }
    }

    const hapusRekin = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/rencana_kinerja/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            setRekin(rekin.filter((data) => (data.id_rencana_kinerja !== id)))
            AlertNotification("Berhasil", "Rencana Kinerja Berhasil Dihapus", "success", 1000);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };

    if (loading) {
        return <LoadingSync />
    } else if (Error) {
        return <h1 className="text-red-500 py-3 px-5 text-center">Gagal mendapatkan data Rencana Kinerja KAK, periksa koneksi internet atau database server</h1>
    }

    return (
        <>
            <div className="flex items-center justify-between border-b px-5 py-5">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <h1 className="font-bold text-2xl uppercase">Rencana Kinerja</h1>
                        <h1 className="font-bold text-2xl uppercase text-green-500">{branding?.tahun?.label}</h1>
                    </div>
                    <ButtonSkyBorder
                        className="flex items-center justify-center"
                        onClick={() => setModalNew(true)}
                    >
                        <TbCirclePlus className="mr-1" />
                        Tambah Rencana kinerja
                    </ButtonSkyBorder>
                </div>
                {/* {(User?.roles == 'eselon_1' || User?.roles == 'eselon_2' || User?.roles == 'eselon_3' || User?.roles == 'eselon_4') && */}
                <div className="flex flex-col items-end">
                    <p>{User?.nama_pegawai || "-"}</p>
                    <p>{User?.nip || "-"}</p>
                    <RolePill roles={User?.roles} className="[&>span]:text-sm [&>span]:px-3 [&>span]:py-1" />
                </div>
                {/* } */}
            </div>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-700 text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Pohon Kinerja</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Rencana Kinerja</th>
                            <th className="border-r border-b px-6 py-3 min-w-[100px]">Tahun</th>
                            <th className="border-r border-b px-6 py-3 min-w-[600px]">Indikator Target Satuan Rencana Kinerja</th>
                            <th className="border-r border-b px-6 py-3 min-w-[100px]">Status</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Catatan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull ?
                            <tr>
                                <td className="px-6 py-3 uppercase" colSpan={13}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                            :
                            rekin.map((data, index) => (
                                <tr key={data.id_rencana_kinerja}>
                                    <td className="border-r border-b px-6 py-4">{index + 1}</td>
                                    <td className="border-r border-b px-6 py-4">{data.nama_pohon ? data.nama_pohon : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{data.nama_rencana_kinerja ? data.nama_rencana_kinerja : "-"}</td>
                                    <td className="border-r border-b px-6 py-4 text-center">{data.tahun ? data.tahun : "-"}</td>
                                    {data.indikator != null ?
                                        <td className="border-r border-b text-center">
                                            <div key={index} className="flex flex-col gap-2 p-2">
                                                {data.indikator.map((item: indikator, index: number) => (
                                                    <React.Fragment key={index}>
                                                        <div className={`flex flex-col gap-2 bg-green-100 border border-green-600 rounded-lg p-5`}>
                                                            <div className="flex items-center justify-between gap-1">
                                                                <p className="text-start">{item.nama_indikator || "-"}</p>
                                                                {item.targets ?
                                                                    item.targets.map((t: target, t_index: number) => (
                                                                        <div className="flex flex-col border border-green-600 rounded-lg px-4 py-1" key={t_index}>
                                                                            <p className="border-b border-black">{t.target || "-"}</p>
                                                                            <p>{t.satuan || "-"}</p>
                                                                        </div>
                                                                    ))
                                                                    :
                                                                    <div className="flex flex-col border border-green-600 rounded-lg px-4 py-1">
                                                                        <p>-</p>
                                                                    </div>
                                                                }
                                                            </div>
                                                            <ButtonGreenBorder
                                                                halaman_url={`rencanakinerja/manual_ik/${item.id_indikator}`}
                                                                className="w-full flex items-center gap-1"
                                                            >
                                                                <TbFileDescription />
                                                                Manual IK
                                                            </ButtonGreenBorder>
                                                        </div>
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </td>
                                        :
                                        <>
                                            <td className="border-r border-b px-6 py-4 text-center">-</td>
                                        </>
                                    }
                                    <td className="border-r border-b px-6 py-4 text-center">{data.status_rencana_kinerja ? data.status_rencana_kinerja : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{data.catatan ? data.catatan : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">
                                        <div className="flex flex-col justify-center items-center gap-2">
                                            <ButtonSkyBorder
                                                className="w-full"
                                                onClick={() => handleEditRekin(data.id_rencana_kinerja)}
                                            >
                                                <TbPencil className="mr-1" />
                                                Edit Rekin
                                            </ButtonSkyBorder>
                                            <ButtonBlackBorder
                                                className="w-full"
                                                onClick={() => handleCloneRekin(data)}
                                            >
                                                <TbLayersSelected className="mr-1" />
                                                Clone
                                            </ButtonBlackBorder>
                                            {(User?.roles == "level_2" || User?.roles == 'level_3' || User?.roles == 'level_4') &&
                                                <ButtonGreenBorder
                                                    className="w-full"
                                                    halaman_url={`/rencanakinerja/${data.id_rencana_kinerja}`}
                                                >
                                                    <TbPencilDown className="mr-1" />
                                                    {User?.roles == 'level_4' ?
                                                        "Renaksi"
                                                        :
                                                        "Rincian"
                                                    }
                                                </ButtonGreenBorder>
                                            }
                                            <ButtonRedBorder className="w-full"
                                                onClick={() => {
                                                    AlertQuestion("Hapus?", "Hapus Rencana Kinerja yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                        if (result.isConfirmed) {
                                                            hapusRekin(data.id_rencana_kinerja);
                                                        }
                                                    });
                                                }}
                                            >
                                                <TbTrash className="mr-1" />
                                                Hapus
                                            </ButtonRedBorder>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <ModalRencanaKinerja
                    metode="baru"
                    tahun={String(branding?.tahun?.value)}
                    kode_opd={User?.kode_opd}
                    nip={User?.nip}
                    pegawai_id={User?.pegawai_id}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                    isOpen={ModalNew}
                    onClose={() => setModalNew(false)}
                    roles={User?.roles}
                />
                <ModalRencanaKinerja
                    id={IdRekin || ''}
                    metode="lama"
                    tahun={String(branding?.tahun?.value)}
                    kode_opd={User?.kode_opd}
                    nip={User?.nip}
                    pegawai_id={User?.pegawai_id}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                    isOpen={ModalEdit}
                    onClose={() => handleEditRekin('')}
                    roles={User?.roles}
                />
                {ModalCloneOpen &&
                    <ModalCloneRekin
                        isOpen={ModalCloneOpen}
                        onClose={() => handleCloneRekin(null)}
                        Data={DataModalClone}
                    />
                }
            </div>
        </>
    )
}