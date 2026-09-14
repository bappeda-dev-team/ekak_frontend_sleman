'use client'

import { useState, useEffect } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { getToken } from "@/components/lib/Cookie";

interface Opd {
    id: number;
    opd_kode: string;
    opd_level: number;
    opd_nama: string;
    kode_nomenklatur: string;
}

interface ApiResponse<T> {
    code: number;
    status: string;
    message: string;
    data: T;
}

const Table = () => {
    const [opd, setOpd] = useState<Opd[]>([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dataNull, setDataNull] = useState(false);

    const token = getToken();

    useEffect(() => {
        const fetchOpd = async () => {
            setLoading(true);
            setError(false);

            try {
                const response = await fetch("/api-data-master/opd/findall", {
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const result: ApiResponse<Opd[] | null> =
                    await response.json();

                if (result.code === 401) {
                    setError(true);
                    return;
                }

                if (!response.ok) {
                    throw new Error(
                        result.message || "Gagal mengambil data OPD"
                    );
                }

                if (!result.data || result.data.length === 0) {
                    setOpd([]);
                    setDataNull(true);
                    return;
                }

                setOpd(result.data);
                setDataNull(false);
            } catch (err) {
                console.error("Fetch OPD error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchOpd();
    }, [token]);

    if (loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">
                    Periksa koneksi internet atau database server
                </h1>
            </div>
        );
    }

    return (
        <div className="overflow-auto m-2 rounded-t-xl border">
            <table className="w-full">
                <thead>
                    <tr className="bg-[#99CEF5] text-white">
                        <th className="border-r border-b px-6 py-3 min-w-[50px]">
                            No
                        </th>

                        <th className="border-r border-b px-6 py-3 min-w-[200px]">
                            Kode Perangkat Daerah
                        </th>

                        <th className="border-r border-b px-6 py-3 min-w-[100px]">
                            Level
                        </th>

                        <th className="border-r border-b px-6 py-3 min-w-[300px]">
                            Nama Perangkat Daerah
                        </th>

                        <th className="border-l border-b px-6 py-3 min-w-[200px]">
                            Kode Nomenklatur
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {dataNull ? (
                        <tr>
                            <td
                                className="px-6 py-5 text-center uppercase"
                                colSpan={5}
                            >
                                Data Kosong / Belum Ditambahkan
                            </td>
                        </tr>
                    ) : (
                        opd.map((data, index) => (
                            <tr key={data.id}>
                                <td className="border-r border-b px-6 py-4">
                                    {index + 1}
                                </td>

                                <td className="border-r border-b px-6 py-4">
                                    {data.opd_kode || "-"}
                                </td>

                                <td className="border-r border-b px-6 py-4 text-center">
                                    {data.opd_level ?? "-"}
                                </td>

                                <td className="border-r border-b px-6 py-4">
                                    {data.opd_nama || "-"}
                                </td>

                                <td className="border-r border-b px-6 py-4">
                                    {data.kode_nomenklatur}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
