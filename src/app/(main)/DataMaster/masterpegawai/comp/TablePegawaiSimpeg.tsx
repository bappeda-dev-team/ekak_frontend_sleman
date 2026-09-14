'use client'

import { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { useBrandingContext } from "@/context/BrandingContext";
import { getToken } from "@/components/lib/Cookie";

interface Table {
    kode_opd: string;
    fetchTrigger: number;
}

export interface DataMasterPegawaiResponse {
    id: number;
    opd_kode: string;

    pegawai_nip: string;
    pegawai_nama: string;

    pegawai_jenis_kelamin: string | null;

    pegawai_lahir_tempat: string | null;
    pegawai_lahir_tanggal: string | null;

    pegawai_pensiun_tmt: string | null;

    pegawai_aktif_id: string | null;
    pegawai_status: string | null;
    pegawai_jenis: string | null;

    pegawai_golongan_kode: string | null;
    pegawai_golongan_nama: string | null;
    pegawai_golongan_pangkat: string | null;
    pegawai_golongan_tmt: string | null;

    pegawai_jenis_jabatan_kode: string | null;
    pegawai_jenis_jabatan_nama: string | null;

    pegawai_jabatan_kode: string | null;
    pegawai_jabatan_terakhir: string | null;

    pegawai_eselon_kode: string | null;
    pegawai_eselon_nama: string | null;

    opd_level: number | null;
    opd_nama: string | null;
}

const TablePegawaiSimpeg: React.FC<Table> = ({ kode_opd, fetchTrigger }) => {

    const [Data, setData] = useState<DataMasterPegawaiResponse[]>([]);

    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const { branding } = useBrandingContext();

    const token = getToken();

    useEffect(() => {
        const fetchPegawai = async () => {
            setLoading(true)
            try {
                const response = await fetch(`/api-data-master/pegawai/find?kodeOpd=${encodeURIComponent(kode_opd)}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                if (result.code === 200) {
                    if (data === null) {
                        setData([]);
                    } else {
                        setData(data);
                    }
                } else {
                    setData([]);
                    setError(true);
                }
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        fetchPegawai();
    }, [kode_opd, branding, fetchTrigger, token]);

    if (Loading) {
        return (
            <div className="border border-gray-200 p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="w-full border border-gray-200 p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 font-bold mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else if (branding?.user?.roles == 'super_admin') {
        if (branding?.opd?.value == undefined || null) {
            return (
                <div className="border p-5 rounded-xl shadow-xl">
                    <h1 className="mx-5 py-5">Super Admin Wajib Pilih OPD di header terlebih dahulu</h1>
                </div>
            )
        }
    }
    return (
        <table className="w-full">
            <thead>
                <tr className="bg-orange-500 text-white">
                    <th className="border-r border-b border-gray-200 px-6 py-3 w-[50px] text-center">
                        No
                    </th>

                    <th className="border-r border-b border-gray-200 px-6 py-3 w-[180px]">
                        NIP
                    </th>

                    <th className="border-r border-b border-gray-200 px-6 py-3 min-w-[250px]">
                        Nama Pegawai
                    </th>

                    <th className="border-r border-b border-gray-200 px-6 py-3 min-w-[300px]">
                        Jabatan
                    </th>

                    <th className="border-r border-b border-gray-200 px-6 py-3 min-w-[250px]">
                        Perangkat Daerah
                    </th>
                </tr>
            </thead>

            <tbody>
                {Data.length > 0 ? (
                    Data.map(
                        (item: DataMasterPegawaiResponse, index: number) => (
                            <tr key={item.id}>
                                <td className="border-x border-b border-orange-500 py-4 px-3 text-center">
                                    {index + 1}
                                </td>

                                <td className="border-r border-b border-orange-500 px-6 py-4 text-center">
                                    {item.pegawai_nip || "-"}
                                </td>

                                <td className="border-r border-b border-orange-500 px-6 py-4">
                                    {item.pegawai_nama || "-"}
                                </td>

                                <td className="border-r border-b border-orange-500 px-6 py-4">
                                    {item.pegawai_jabatan_terakhir || "-"}
                                </td>

                                <td className="border-r border-b border-orange-500 px-6 py-4">
                                    {item.opd_nama || "-"}
                                </td>
                            </tr>
                        )
                    )
                ) : (
                    <tr>
                        <td
                            className="px-6 py-3 text-center"
                            colSpan={5}
                        >
                            Data Kosong / Belum Ditambahkan
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    )

}

export default TablePegawaiSimpeg;
