'use client'

import { FiHome } from "react-icons/fi";
import { useState } from "react";
import TableSimpeg from "@/components/pages/datamaster/masteropd/TableSimpeg";
import { TableLoading } from "@/components/global/Loading"
import { SyncDataMasterOpd } from "@/components/global/SyncButton";
import { toast } from 'react-toastify';

const Page = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const syncSimpeg = async () => {
        setLoading(true)
        try {
            const response = await fetch("/api-data-master/opd/sync", {
                method: 'POST'
            })

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.message ?? "SYNC SIMPEG GAGAL"
                )
            }
            toast.success("✅ SYNC BERHASIL")
        } catch (err) {
            console.error("Sync SIMPEG error:", err);

            toast.error(
                err instanceof Error
                    ? `❌ ${err.message}`
                    : "❌ Gagal SYNC SIMPEG"
            );
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master OPD</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-col items-end">
                        <h1 className="uppercase font-bold">Daftar OPD</h1>
                    </div>
                    <div className="flex gap-3">
                        <SyncDataMasterOpd loading={loading} onSync={syncSimpeg} />
                    </div>
                </div>
                {loading ? <TableLoading rowCount={5} /> : <TableSimpeg />}
            </div>
        </>
    )
}

export default Page;
