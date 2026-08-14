'use client'

import { FiHome } from "react-icons/fi";
import { getOpdTahun, getUser } from "@/components/lib/Cookie";
import { useState, useEffect } from "react";
import Table from "./comp/Table";
import Maintenance from "@/components/global/Maintenance";
import { OpdNull, TahunNull } from "@/components/global/OpdTahunNull";

const SubKegiatanOpd = () => {

    const [User, setUser] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);

    const nama_opd = User?.roles == 'super_admin' ? SelectedOpd?.label : User?.nama_opd;
    const kode_opd = User?.roles == 'super_admin' ? SelectedOpd?.value : User?.kode_opd;

    useEffect(() => {
        const data = getOpdTahun();
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        if (data.tahun) {
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
        if (data.opd) {
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    }, []);

    return (
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan OPD</p>
                <p className="mr-1">/ Bidang Urusan OPD</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-wrap items-end">
                        <h1 className="uppercase font-bold">Bidang Urusan OPD </h1>
                        <h1 className="uppercase font-bold ml-1 text-slate-500">{nama_opd || "OPD tidak diketahui"}</h1>
                    </div>
                </div>
                {(User?.roles == 'super_admin' || User?.roles == 'reviewer') &&
                    SelectedOpd?.value === undefined ? (
                    <OpdNull />
                ) : (
                    Tahun?.value !== undefined ?
                        <div className="m-1">
                            {/* <Maintenance /> */}
                            <Table kode_opd={kode_opd}/>

                        </div>
                        :
                        <div className="m-5">
                            <TahunNull />
                        </div>
                )
                }
            </div>
        </>
    )
}

export default SubKegiatanOpd;