'use client'

import { ButtonBlack, ButtonBlackBorder, ButtonGreen, ButtonRed, ButtonSky } from "@/components/global/Button";
import { useState, useEffect } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import { useBrandingContext } from "@/context/BrandingContext";
import { TbSearch, TbCirclePlus } from "react-icons/tb";
import { ModalMasterPegawai } from "./ModalMasterPegawai";
import { ModalJabatanPegawai } from "./ModalJabatanPegawai";

interface OptionTypeString {
    value: string;
    label: string;
}
interface pegawai {
    id: string;
    nama_pegawai: string;
    nip: string;
    kode_opd: string;
    nama_opd: string;
    id_jabatan: string;
    nama_jabatan: string;
}

const Table = () => {

    const { branding } = useBrandingContext();
    const [Pegawai, setPegawai] = useState<pegawai[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const token = getToken();

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [ModalJabatanOpen, setModalJabatanOpen] = useState<boolean>(false);
    const [DataModal, setDataModal] = useState<pegawai | null>(null);
    const [JenisModal, setJenisModal] = useState<"tambah" | "edit">("tambah");
    const [NamaOpd, setNamaOpd] = useState<string>("");
    const [KodeOpd, setKodeOpd] = useState<string>("");
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const handleModal = (jenis: "tambah" | "edit", Data: pegawai | null, nama_opd: string, kode_opd: string) => {
        if (ModalOpen) {
            setModalOpen(false);
            setJenisModal(jenis);
            setDataModal(Data);
            setNamaOpd(nama_opd);
            setKodeOpd(kode_opd);
        } else {
            setModalOpen(true);
            setJenisModal(jenis);
            setDataModal(Data);
            setNamaOpd(nama_opd);
            setKodeOpd(kode_opd);
        }
    }

    const fetchPegawai = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${branding.api_perencanaan}/pegawai/findall?nip=${searchQuery}`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            const data = result.data;
            if (data == null) {
                setDataNull(true);
                setPegawai([]);
            } else if (result.code === 401) {
                setError(true);
            } else {
                setDataNull(false);
                setPegawai(data);
                setError(false);
            }
            setPegawai(data);
        } catch (err) {
            setError(true);
            console.error(err)
        } finally {
            setLoading(false);
        }
    }

    const handleModalJabatan = (Data: pegawai | null) => {
        if (ModalJabatanOpen) {
            setModalJabatanOpen(false);
            setDataModal(Data);
        } else {
            setModalJabatanOpen(true);
            setDataModal(Data);
        }
    }

    const hapusPegawai = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/pegawai/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            setPegawai(Pegawai.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data pegawai Berhasil Dihapus", "success", 1000);
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
    } else if (error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    }

    return (
        <>
            <div className="w-full flex gap-2 items-center uppercase px-3 py-2">
                <div className="w-full flex px-2 items-center">
                    <TbSearch className="absolute ml-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Masukkan NIP Lengkap"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-2 pl-10 pr-2 border rounded-lg border-gray-300"
                    />
                </div>
                <ButtonBlackBorder
                    className="flex items-center gap-1"
                    onClick={() => {
                        if(searchQuery !== ""){
                            fetchPegawai()
                        } else {
                            AlertNotification("NIP Tidak Boleh Kosong", "", "error", 1000);
                        }
                    }
                    }
                >
                    <TbSearch />
                    Cari
                </ButtonBlackBorder>
            </div>
            <div className="overflow-auto mx-3 my-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#99CEF5] text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Nama</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">NIP</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Jabatan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Perangkat Daerah</th>
                            <th className="border-r border-b px-6 py-3 min-w-[100px]">Kode OPD</th>
                            <th className="border-l border-b px-6 py-3 min-w-[100px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(DataNull || Pegawai.length === 0) ?
                            <tr>
                                <td className="px-6 py-3 uppercase" colSpan={13}>
                                    Tidak Ditemukan
                                </td>
                            </tr>
                            :
                            Pegawai.map((data, index) => (
                                <tr key={data?.id}>
                                    <td className="border-r border-b px-6 py-4">{index + 1}</td>
                                    <td className="border-r border-b px-6 py-4">{data?.nama_pegawai ? data.nama_pegawai : "-"}</td>
                                    <td className="border-r border-b px-6 py-4 text-center">{data?.nip ? data.nip : "-"}</td>
                                    <td className="border-r border-b px-6 py-4 text-center">{data?.nama_jabatan ? data.nama_jabatan : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{data?.nama_opd ? data.nama_opd : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{data?.kode_opd ? data.kode_opd : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">
                                        <div className="flex flex-col jutify-center items-center gap-2">
                                            <ButtonGreen
                                                className="w-full"
                                                onClick={() => handleModal("edit", data, data?.nama_opd, data?.kode_opd)}
                                            >
                                                Edit
                                            </ButtonGreen>
                                            <ButtonBlack
                                                className="w-full"
                                                onClick={() => handleModalJabatan(data)}
                                            >
                                                Jabatan
                                            </ButtonBlack>
                                            <ButtonRed
                                                className="w-full"
                                                onClick={() => {
                                                    AlertQuestion("Hapus?", "Hapus Pegawai yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                        if (result.isConfirmed) {
                                                            hapusPegawai(data.id);
                                                        }
                                                    });
                                                }}
                                            >
                                                Hapus
                                            </ButtonRed>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {ModalOpen &&
                <ModalMasterPegawai
                    isOpen={ModalOpen}
                    onClose={() => handleModal("tambah", null, "", "")}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                    Data={DataModal}
                    jenis={JenisModal}
                    kode_opd={KodeOpd}
                    nama_opd={NamaOpd}
                />
            }
            {ModalJabatanOpen &&
                <ModalJabatanPegawai
                    onClose={() => handleModalJabatan(null)}
                    isOpen={ModalJabatanOpen}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                    Data={DataModal}
                    kode_opd={KodeOpd}
                    nama_opd={NamaOpd}
                />
            }
        </>
    )
}

export default Table;