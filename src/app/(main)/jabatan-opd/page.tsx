'use client'

import { TableLoading } from "@/components/global/Loading";
import { useEffect, useState } from "react";
import { getUser, getOpdTahun } from "@/components/lib/Cookie";
import { SyncDataMasterJabatan } from "@/components/global/SyncButton";
import { FiHome } from "react-icons/fi";
import { toast } from "react-toastify";
import TableJabatanSimpeg from "./comp/TableJabatanSimpeg";

const JabatanOpd = () => {

    const [User, setUser] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);

    // Loading saat pertama kali mengambil context user/OPD/tahun
    const [initialLoading, setInitialLoading] = useState(true);

    // Loading hanya untuk proses sync
    const [syncLoading, setSyncLoading] = useState(false);

    // Berubah setiap kali sync berhasil
    const [fetchTrigger, setFetchTrigger] = useState(0);

    useEffect(() => {
        const data = getOpdTahun();
        const fetchUser = getUser();

        if (data?.tahun) {
            setTahun(data.tahun.value);
        }

        if (data?.opd) {
            setSelectedOpd({
                value: data.opd.value,
                label: data.opd.label,
            });
        }

        if (fetchUser) {
            setUser(fetchUser.user);
        }
        setInitialLoading(false);
    }, []);

    const isSuperAdmin = User?.roles.some((r: string) => ["super_admin"].includes(r));

    const nama_opd = isSuperAdmin
        ? SelectedOpd?.label
        : User?.nama_opd;

    const kode_opd = isSuperAdmin
        ? SelectedOpd?.value
        : User?.kode_opd;

    const syncJabatanSimpeg = async () => {
        if (!kode_opd) {
            toast.error("❌ Kode OPD tidak ditemukan");
            return;
        }

        setSyncLoading(true);

        try {
            const response = await fetch("/api-data-master/jabatan/sync", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    kode_opd: kode_opd,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.message ?? "SYNC SIMPEG GAGAL"
                );
            }

            toast.success("✅ SYNC BERHASIL");

            // Beritahu TableJabatanSimpeg untuk fetch ulang
            setFetchTrigger(prev => prev + 1);

        } catch (err) {
            console.error("Sync SIMPEG error:", err);

            toast.error(
                err instanceof Error
                    ? `❌ ${err.message}`
                    : "❌ Gagal SYNC SIMPEG"
            );
        } finally {
            setSyncLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1">
                    <FiHome />
                </a>

                <p className="mr-1">/ Data Master OPD</p>
                <p className="mr-1">/ Master Jabatan OPD</p>
            </div>

            <div className="mt-3 rounded-xl shadow-lg border">

                <div className="flex items-center justify-between border-b px-5 py-5">

                    <div className="flex flex-col gap-1">
                        <h1 className="uppercase font-bold">
                            Daftar Jabatan - {nama_opd || ""}
                        </h1>

                        <h3>
                            Tahun {Tahun || "-"}
                        </h3>
                    </div>

                    <SyncDataMasterJabatan
                        loading={syncLoading}
                        onSync={syncJabatanSimpeg}
                    />

                </div>

                <div className="flex flex-wrap m-2">
                    <div className="overflow-auto m-2 rounded-t-xl border border-gray-200 w-full">

                        {initialLoading || syncLoading || !kode_opd ? (
                            <TableLoading rowCount={5} />
                        ) : (
                            <TableJabatanSimpeg
                                kode_opd={kode_opd}
                                fetchTrigger={fetchTrigger}
                            />
                        )}

                    </div>
                </div>

            </div>
        </>
    );
}

export default JabatanOpd;
