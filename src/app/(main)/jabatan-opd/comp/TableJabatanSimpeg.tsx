'use client'

import { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { useBrandingContext } from "@/context/BrandingContext";
import { getToken } from "@/components/lib/Cookie";

interface Table {
    kode_opd: string;
    fetchTrigger: number;
}

interface DataMasterJabatanResponse {
    id: number;
    opd_kode: string;
    jenis_jabatan_kode: string;
    jenis_jabatan_nama?: string | null;
    jabatan_kode: string;
    jabatan_nama: string;
    jenjang_jabatan_kode?: string | null;
    jenjang_jabatan_nama?: string | null;
}

const TableJabatanSimpeg: React.FC<Table> = ({ kode_opd, fetchTrigger }) => {

    const [Data, setData] = useState<DataMasterJabatanResponse[]>([]);

    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const { branding } = useBrandingContext();

    const token = getToken();

    useEffect(() => {
        const fetchJabatan = async () => {
            setLoading(true)
            try {
                const response = await fetch(`/api-data-master/jabatan/find?kodeOpd=${encodeURIComponent(kode_opd)}`, {
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
        fetchJabatan();
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

                    <th className="border-r border-b border-gray-200 px-6 py-3 min-w-[250px]">
                        Nama Jabatan
                    </th>

                    <th className="border-r border-b border-gray-200 px-6 py-3 min-w-[200px]">
                        Jenis Jabatan
                    </th>

                    <th className="border-r border-b border-gray-200 px-6 py-3 min-w-[200px]">
                        Jenjang Jabatan
                    </th>

                    <th className="border-l border-b border-gray-200 px-6 py-3 w-[100px]">
                        Aksi
                    </th>
                </tr>
            </thead>

            <tbody>
                {Data.length > 0 ? (
                    Data.map(
                        (item: DataMasterJabatanResponse, index: number) => (
                            <tr key={item.id}>
                                <td className="border-x border-b border-orange-500 py-4 px-3 text-center">
                                    {index + 1}
                                </td>

                                <td className="border-r border-b border-orange-500 px-6 py-4 text-center">
                                    {item.jabatan_nama || "-"}
                                </td>

                                <td className="border-r border-b border-orange-500 px-6 py-4 text-center">
                                    {item.jenis_jabatan_nama || "-"}
                                </td>

                                <td className="border-r border-b border-orange-500 px-6 py-4 text-center">
                                    {item.jenjang_jabatan_nama || "-"}
                                </td>

                                <td className="border-r border-b border-orange-500 px-6 py-4 text-center">
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

export default TableJabatanSimpeg;
