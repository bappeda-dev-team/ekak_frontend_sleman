'use client'

import { ButtonBlackBorder, ButtonRed, ButtonSkyBorder } from "@/components/global/Button";
import { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { getToken } from "@/components/lib/Cookie";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { TbCirclePlus, TbRefresh, TbTrash } from "react-icons/tb";
import { useBrandingContext } from "@/context/BrandingContext";
import { ModalBidangUrusanOpd } from "./ModalBidangUrusanOpd";
import { BidangUrusanFindall } from "../type";

interface table {
    kode_opd: string;
}

const Table: React.FC<table> = ({ kode_opd }) => {

    const [Data, setData] = useState<BidangUrusanFindall[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const token = getToken();
    const { branding } = useBrandingContext();

    // MODAL & TRIGGER
    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [fetchTrigger, setfetchTrigger] = useState<boolean>(false);

    useEffect(() => {
        const fetchSubKegiatan = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${branding?.api_perencanaan}/bidang_urusan_opd/findall/${kode_opd}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                if (data === null) {
                    setDataNull(true);
                    setData([]);
                } else if (data.code == 500) {
                    setError(true);
                    setData([]);
                } else {
                    setDataNull(false);
                    setData(data);
                }
                setData(data);
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        if (kode_opd) {
            fetchSubKegiatan();
        }
    }, [kode_opd, fetchTrigger, token]);

    const handleModal = () => {
        if (ModalOpen) {
            setModalOpen(false);
        } else {
            setModalOpen(true);
        }
    }
    const refresh = () => {
        setfetchTrigger((prev) => !prev);
    }

    const hapusBidangUrusan = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/bidang_urusan_opd/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if(result.code === 200){
                setData(Data.filter((data) => (data.id !== id)))
                AlertNotification("Berhasil", "Data Bidang Urusan OPD Berhasil Di hapus", "success", 1000);
            } else {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    }

    return (
        <>
            <div className="flex items-center gap-1 m-2">
                <ButtonSkyBorder
                    className="flex items-center gap-1"
                    onClick={() => handleModal()}
                >
                    <TbCirclePlus />
                    Tambah Bidang Urusan
                </ButtonSkyBorder>
                <ButtonBlackBorder
                    className="flex items-center gap-1"
                    onClick={refresh}
                >
                    <TbRefresh />
                    Refresh
                </ButtonBlackBorder>
            </div>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-red-500 text-white">
                            <th className="border-r border-b px-6 py-3 w-[50px] text-center">No</th>
                            <th className="border-r border-b px-6 py-3 w-[200px]">Kode Bidang Urusan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[300px]">Nama Bidang Urusan</th>
                            <th className="border-l border-b px-6 py-3 w-[100px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull ?
                            <tr>
                                <td className="px-6 py-3 uppercase" colSpan={5}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                            :
                            Data.map((data: BidangUrusanFindall, index: number) => (
                                <tr key={data.id}>
                                    <td className="border-r border-b px-6 py-4 text-center">{index + 1}</td>
                                    <td className="border-r border-b px-6 py-4">{data.kode_bidang_urusan || "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{data.nama_bidang_urusan || "-"}</td>
                                    <td className="border-r border-b px-6 py-4">
                                        <ButtonRed
                                            className="w-full flex items-center gap-1"
                                            onClick={() => {
                                                AlertQuestion("Hapus?", "Hapus Bidang Urusan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                    if (result.isConfirmed) {
                                                        hapusBidangUrusan(data.id);
                                                    }
                                                });
                                            }}
                                        >
                                            <TbTrash />
                                            Hapus
                                        </ButtonRed>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {ModalOpen &&
                <ModalBidangUrusanOpd 
                    isOpen={ModalOpen}
                    onClose={() => handleModal()}
                    onSuccess={refresh}
                    kode_opd={kode_opd}
                />
            }
        </>
    )
}

export default Table;
