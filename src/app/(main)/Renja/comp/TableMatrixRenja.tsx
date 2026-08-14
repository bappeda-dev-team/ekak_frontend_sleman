'use client'

import { getToken } from "@/components/lib/Cookie";
import React, { useEffect, useState } from "react";
import { ButtonSky, ButtonBlackBorder, ButtonSkyBorder } from "@/components/global/Button";
import { TbLockCancel, TbPencil, TbCirclePlus, TbLockOpen, TbLockFilled, TbRefresh, TbPrinter } from "react-icons/tb";
import { LoadingClip } from "@/components/global/Loading";
import { ModalIndikatorMatrixRenja } from "./ModalIndikatorMatrixRenja";
import { ModalAnggaranMatrixRenja } from "./ModalAnggaranMatrixRenja";
import { useBrandingContext } from "@/context/BrandingContext";

interface Renja {
    nama: string;
    kode: string;
    jenis: string;
    indikator: Indikator[];
    anggaran: Anggaran[];
    bidang_urusan?: Renja[];
    program?: Renja[]
    kegiatan?: Renja[]
    subkegiatan?: Renja[]
}
interface matrix {
    kode_opd: string
    tahun_awal: string;
    tahun_akhir: string;
    pagu_total: pagu[];
    urusan: Renja[];
}
type combinedData = Anggaran & Partial<Indikator>;

interface Anggaran {
    tahun: string;
    pagu_indikatif: number;
    jenis_pagu: string;
}
interface Indikator {
    id: string;
    kode_indikator: string;
    kode: string;
    kode_opd: string;
    indikator: string;
    tahun: string;
    target: string;
    satuan: string;
    status_target_renja: boolean;
}
interface Target {
    id: string;
    indikator_id: string;
    target: string;
    satuan: string;
}
interface pagu {
    tahun: string;
    pagu_indikatif: number;
    jenis_pagu: string;
}
interface table {
    jenis: "laporan" | "opd";
    kode_opd: string;
    menu: "ranwal" | "rankhir" | "penetapan";
    tahun: string;
}


export const TableMatrixRenja: React.FC<table> = ({ jenis, tahun, menu, kode_opd }) => {

    const [Matrix, setMatrix] = useState<matrix[]>([]);

    const [Loading, setLoading] = useState<boolean>(false);
    const [DataNull, setDataNull] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const token = getToken();

    const [Lock, setLock] = useState<boolean>(false);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchMatrix = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/matrix_renja/${menu}/${kode_opd}/${tahun}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                // console.log(data);
                if (result.code === 400) {
                    setDataNull(true);
                    setMatrix([]);
                    console.log(data);
                } else if (result.code === 200) {
                    setDataNull(false);
                    setMatrix(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchMatrix();
    }, [kode_opd, tahun, token, FetchTrigger, menu]);

    if (DataNull) {
        return (
            <h1 className="p-5 text-red-500 font-semibold">Sub Kegiatan OPD belum di pilih pada tahun {tahun || 0}</h1>
        )
    }
    if (Loading) {
        return (
            <>
                <LoadingClip />
            </>
        )
    }

    return (
        <>
            {menu === "penetapan" &&
                <div className="px-3 py-2">
                    <div className={`flex items-center justify-between p-2 text-white rounded-lg ${Lock ? "bg-red-500" : "bg-emerald-500"}`}>
                        {Lock ?
                            <div className="flex items-center gap-1">
                                <TbLockFilled />
                                <p>Data terkunci tidak bisa di ubah</p>
                            </div>
                            :
                            <div className="flex items-center gap-1">
                                <TbLockOpen />
                                <p>Data terbuka dan bisa di ubah</p>
                            </div>
                        }
                        {Lock ?
                            <div className="flex items-center gap-1">
                                <ButtonSky className="flex items-center gap-1">
                                    <TbPrinter />
                                    Cetak
                                </ButtonSky>
                                <ButtonBlackBorder className="bg-white flex items-center gap-1">
                                    <TbLockOpen />
                                    Buka Kunci
                                </ButtonBlackBorder>
                            </div>
                            :
                            <div className="flex items-center gap-1">
                                <ButtonSkyBorder className="bg-white flex items-center gap-1">
                                    <TbRefresh />
                                    Sync
                                </ButtonSkyBorder>
                                <ButtonBlackBorder className="bg-white flex items-center gap-1">
                                    <TbLockFilled />
                                    Kunci Data
                                </ButtonBlackBorder>
                            </div>
                        }
                    </div>
                </div>
            }
            {Matrix.map((item: matrix, index: number) => (
                <React.Fragment key={index}>
                    <div className="overflow-auto m-2 rounded-xl border">
                        <TableTotalPagu
                            tahun={tahun}
                            pagu_total={item.pagu_total[0]?.pagu_indikatif || 0}
                        />
                    </div>
                    <div className="overflow-auto m-2 rounded-t-xl border">
                        {item.urusan.length === 0 ?
                            <h1 className="p-5">Sub Kegiatan di tahun {tahun || 0} belum di gunakan di rencana kinerja</h1>
                            :
                            <table className="w-full">
                                {item.urusan.map((u: Renja, u_index: number) => (
                                    <React.Fragment key={u_index}>
                                        <TheadMatrix
                                            tahun={String(tahun) || "0"}
                                            jenis="Urusan"
                                            type={jenis}
                                            menu={menu}
                                        />
                                        <tbody>
                                            <TrMatrix
                                                jenis="Urusan"
                                                type={jenis}
                                                indikator={u.indikator}
                                                anggaran={u.anggaran}
                                                kode={u.kode}
                                                nama={u.nama}
                                                kode_opd={item.kode_opd}
                                                fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                                lock={Lock}
                                                menu={menu}
                                            />
                                        </tbody>
                                        {u.bidang_urusan &&
                                            <React.Fragment>
                                                {u.bidang_urusan.map((br: Renja, br_index: number) => (
                                                    <React.Fragment key={br_index}>
                                                        <TheadMatrix
                                                            tahun={String(tahun) || "0"}
                                                            jenis="Bidang Urusan"
                                                            type={jenis}
                                                            menu={menu}
                                                        />
                                                        <tbody>
                                                            <TrMatrix
                                                                jenis="Bidang Urusan"
                                                                type={jenis}
                                                                indikator={br.indikator}
                                                                anggaran={br.anggaran}
                                                                kode={br.kode}
                                                                nama={br.nama}
                                                                kode_opd={kode_opd}
                                                                fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                                                lock={Lock}
                                                                menu={menu}
                                                            />
                                                        </tbody>
                                                        {br.program &&
                                                            <React.Fragment>
                                                                {br.program.map((p: Renja, p_index: number) => (
                                                                    <React.Fragment key={p_index}>
                                                                        <TheadMatrix
                                                                            tahun={String(tahun) || "0"}
                                                                            jenis="Program"
                                                                            type={jenis}
                                                                            menu={menu}
                                                                        />
                                                                        <tbody>
                                                                            <TrMatrix
                                                                                jenis="Program"
                                                                                type={jenis}
                                                                                indikator={p.indikator}
                                                                                anggaran={p.anggaran}
                                                                                kode={p.kode}
                                                                                nama={p.nama}
                                                                                kode_opd={kode_opd}
                                                                                fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                                                                lock={Lock}
                                                                                menu={menu}
                                                                            />
                                                                        </tbody>
                                                                        {p.kegiatan &&
                                                                            <React.Fragment>
                                                                                {p.kegiatan.map((k: Renja, k_index: number) => (
                                                                                    <React.Fragment key={k_index}>
                                                                                        <TheadMatrix
                                                                                            tahun={String(tahun) || "0"}
                                                                                            jenis="Kegiatan"
                                                                                            type={jenis}
                                                                                            menu={menu}
                                                                                        />
                                                                                        <tbody>
                                                                                            <TrMatrix
                                                                                                jenis="Kegiatan"
                                                                                                type={jenis}
                                                                                                indikator={k.indikator}
                                                                                                anggaran={k.anggaran}
                                                                                                kode={k.kode}
                                                                                                nama={k.nama}
                                                                                                kode_opd={kode_opd}
                                                                                                fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                                                                                lock={Lock}
                                                                                                menu={menu}
                                                                                            />
                                                                                        </tbody>
                                                                                        {k.subkegiatan &&
                                                                                            <React.Fragment>
                                                                                                <TheadMatrix
                                                                                                    tahun={String(tahun) || "0"}
                                                                                                    jenis="Sub Kegiatan"
                                                                                                    type={jenis}
                                                                                                    menu={menu}
                                                                                                />
                                                                                                {k.subkegiatan.map((sk: Renja, sk_index: number) => (
                                                                                                    <React.Fragment key={sk_index}>
                                                                                                        <tbody>
                                                                                                            <TrMatrix
                                                                                                                jenis="Sub Kegiatan"
                                                                                                                type={jenis}
                                                                                                                indikator={sk.indikator}
                                                                                                                anggaran={sk.anggaran}
                                                                                                                kode={sk.kode}
                                                                                                                nama={sk.nama}
                                                                                                                kode_opd={kode_opd}
                                                                                                                fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                                                                                                lock={Lock}
                                                                                                                menu={menu}
                                                                                                            />
                                                                                                        </tbody>
                                                                                                    </React.Fragment>
                                                                                                ))}
                                                                                            </React.Fragment>
                                                                                        }
                                                                                    </React.Fragment>
                                                                                ))}
                                                                            </React.Fragment>
                                                                        }
                                                                    </React.Fragment>
                                                                ))}
                                                            </React.Fragment>
                                                        }
                                                    </React.Fragment>
                                                ))}
                                            </React.Fragment>
                                        }
                                    </React.Fragment>
                                ))}
                            </table>
                        }
                    </div>
                </React.Fragment>
            ))}
        </>
    )
}

interface Thead {
    jenis: "Urusan" | "Bidang Urusan" | "Program" | "Kegiatan" | "Sub Kegiatan";
    type: "laporan" | "opd";
    menu: "ranwal" | "rankhir" | "penetapan";
    tahun: string;
}
export const TheadMatrix: React.FC<Thead> = ({ tahun, jenis, type, menu }) => {
    return (
        <thead>
            <tr className={`
                ${jenis === "Urusan" && "bg-white text-black"}
                ${jenis === "Bidang Urusan" && "bg-red-500 text-white"}
                ${jenis === "Program" && "bg-blue-500 text-white"}
                ${jenis === "Kegiatan" && "bg-green-700 text-white"}
                ${jenis === "Sub Kegiatan" && "bg-emerald-500 text-white"}
            `}>
                <td rowSpan={2} className="border-r border-b px-6 py-4 w-[200px]">Kode</td>
                <td rowSpan={2} className="border-r border-b px-6 py-4 min-w-[200px]">{jenis}</td>
                <td colSpan={(type === "opd" && menu != "ranwal") ? 5 : 4} className="border-r border-b px-6 py-3 min-w-[100px] text-center">{tahun || 0}</td>

            </tr>
            <tr className={`
                ${jenis === "Urusan" && "bg-white text-black"}
                ${jenis === "Bidang Urusan" && "bg-red-500 text-white"}
                ${jenis === "Program" && "bg-blue-500 text-white"}
                ${jenis === "Kegiatan" && "bg-green-700 text-white"}
                ${jenis === "Sub Kegiatan" && "bg-emerald-500 text-white"}
            `}>
                {(jenis === 'Urusan' || jenis === 'Bidang Urusan') ?
                    <td colSpan={(type === "opd" && menu != "ranwal") ? 5 : 4} className="border-l border-b px-6 py-3 min-w-[200px] text-center">Pagu</td>
                    :
                    <>
                        <td className="border-l border-b px-6 py-3 min-w-[300px] text-center">indikator</td>
                        <td className="border-l border-b px-6 py-3 min-w-[50px]">Target</td>
                        <td className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</td>
                        <td className="border-l border-b px-6 py-3 min-w-[200px] text-center">Pagu</td>
                        {(type === "opd" && menu != "ranwal") &&
                            <td className="border-l border-b px-6 py-3 min-w-[50px] text-center">Aksi</td>
                        }
                    </>
                }
            </tr>
        </thead>
    )
}
interface Tr {
    indikator: Indikator[];
    anggaran: Anggaran[];
    nama: string;
    kode: string;
    kode_opd: string;
    jenis: "Urusan" | "Bidang Urusan" | "Program" | "Kegiatan" | "Sub Kegiatan";
    type: "laporan" | "opd";
    menu: "ranwal" | "rankhir" | "penetapan";
    lock: boolean
    fetchTrigger(): void;
}
export const TrMatrix: React.FC<Tr> = ({ jenis, type, kode_opd, kode, menu, nama, anggaran, indikator, lock, fetchTrigger }) => {

    const { branding } = useBrandingContext();
    const [ModalPagu, setModalPagu] = useState<boolean>(false);
    const [Pagu, setPagu] = useState<number>(0);
    const [ModalIndikator, setModalIndikator] = useState<boolean>(false);
    const [DataModal, setDataModal] = useState<Indikator[]>([]);

    const combinedData = anggaran.map((a) => {
        // Ambil SEMUA indikator yang tahunnya sama
        const matchingIndikators = indikator.filter((i) => i.tahun === a.tahun);
        return {
            ...a,
            // Simpan sebagai array di dalam objek anggaran
            list_indikator: matchingIndikators.length > 0 ? matchingIndikators
                : [{
                    id: "",
                    indikator: "-",
                    target: "-",
                    satuan: "-"
                }]
        };
    });

    const handleModalIndikator = (data: Indikator[]) => {
        if (ModalIndikator) {
            setModalIndikator(false);
            setDataModal([]);
        } else {
            setModalIndikator(true);
            setDataModal(data);
        }
    }
    const handleModalPagu = (pagu: number) => {
        if (ModalPagu) {
            setModalPagu(false);
            setPagu(pagu);
        } else {
            setModalPagu(true);
            setPagu(pagu);
        }
    }
    function formatRupiah(angka: number) {
        if (typeof angka !== 'number') {
            return String(angka); // Jika bukan angka, kembalikan sebagai string
        }
        return angka.toLocaleString('id-ID'); // 'id-ID' untuk format Indonesia
    }

    return (
        <>
            {(jenis === 'Urusan' || jenis === 'Bidang Urusan') ?
                <tr>
                    <td className={`border-r border-b px-6 py-4 font-semibold`}>{kode}</td>
                    <td className={`border-r border-b px-6 py-4 w-full`}>{nama}</td>
                    {combinedData.map((i: combinedData, index: number) => (
                        <React.Fragment key={i.id || index}>
                            <td className={`border-b px-6 py-4 w-full text-center`}></td>
                            <td className={`border-b px-6 py-4 w-full text-center`}></td>
                            <td className={`border-r border-b px-6 py-4 w-full text-center`}></td>
                            <td className={`border-b px-6 py-4 w-full text-center`}>
                                <div className="flex flex-col items-center gap-1">
                                    {menu === "penetapan" &&
                                        <p className="p-1 px-2 text-sm rounded-lg bg-slate-300 text-slate-700">
                                            {i.jenis_pagu || 'unknown'}
                                        </p>
                                    }
                                    <span className="font-semibold text-sm">
                                        Rp.{formatRupiah(i.pagu_indikatif)}
                                    </span>
                                </div>
                            </td>
                            {(type === "opd" && menu !== "ranwal") &&
                                <td className={`border-r border-b px-6 py-4 w-full`}></td>
                            }
                        </React.Fragment>
                    ))}
                </tr>
                :
                <>
                    <tr>
                        <td rowSpan={indikator.length ? indikator.length + 1 : 2} className={`border-r border-b px-6 py-4 font-semibold`}>{kode}</td>
                        <td rowSpan={indikator.length ? indikator.length + 1 : 2} className={`border-r border-b px-6 py-4 w-full`}>{nama}</td>
                    </tr>
                    {combinedData.map((c, index: number) => {
                        const totalRowsInYear = c.list_indikator.length;
                        return (
                            <React.Fragment key={index}>
                                {c.list_indikator.map((i, idx) => (
                                    <tr key={i.id || idx}>
                                        {/* KOLOM INDIKATOR */}
                                        <td className="border-r border-b px-6 py-4 w-full">
                                            <div className="flex items-center gap-2">
                                                {i.indikator || "-"}
                                            </div>
                                        </td>
                                        <td className="border-r border-b px-6 py-4 w-full">
                                            {i.target}
                                        </td>

                                        <td className="border-r border-b px-6 py-4 w-full">
                                            {i.satuan}
                                        </td>

                                        {/* KOLOM PAGU: Hanya muncul di baris pertama tiap tahun (idx === 0) */}
                                        {idx === 0 && (
                                            <>
                                                <td
                                                    rowSpan={totalRowsInYear}
                                                    className="border-r border-b px-6 py-4 text-center align-middle"
                                                >
                                                    <div className="flex flex-col items-center gap-2">
                                                        {menu === "penetapan" &&
                                                            <p className="p-1 px-2 text-sm rounded-lg bg-slate-300 text-slate-700">
                                                                {c.jenis_pagu || 'unknown'}
                                                            </p>
                                                        }
                                                        <span className="font-semibold text-sm">
                                                            Rp.{formatRupiah(c.pagu_indikatif || 0)}
                                                        </span>
                                                        {jenis === "Sub Kegiatan" ?
                                                            menu === "penetapan" &&
                                                                lock ?
                                                                <div className="text-red-500 flex items-center justify-center">
                                                                    <TbLockCancel size={20} />
                                                                </div>
                                                                :
                                                                <button
                                                                    type="button"
                                                                    className="text-sky-400 border border-sky-300 hover:text-sky-600 p-1 rounded-full hover:bg-sky-100 transition-colors"
                                                                    title="Edit Pagu Anggaran"
                                                                    onClick={() => handleModalPagu(c.pagu_indikatif || 0)}
                                                                >
                                                                    <TbPencil size={14} />
                                                                </button>
                                                            :
                                                            <></>
                                                        }
                                                    </div>
                                                </td>
                                                <td
                                                    rowSpan={totalRowsInYear}
                                                    className="border-r border-b px-6 py-4 text-center align-middle"
                                                >
                                                    {(type === "opd" && menu !== "ranwal") &&
                                                        (menu === "penetapan" && lock) ?
                                                        <div className="text-red-500 flex items-center justify-center">
                                                            <TbLockCancel size={30} />
                                                        </div>
                                                        :
                                                        <ButtonSkyBorder
                                                            className="flex items-center gap-1"
                                                            onClick={() => handleModalIndikator(indikator)}
                                                        >
                                                            <TbCirclePlus />
                                                            <p className="text-sm">Indikator</p>
                                                        </ButtonSkyBorder>
                                                    }
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </React.Fragment>
                        );
                    })}
                </>
            }
            {ModalIndikator &&
                <ModalIndikatorMatrixRenja
                    isOpen={ModalIndikator}
                    onClose={() => handleModalIndikator([])}
                    onSuccess={fetchTrigger}
                    kode_opd={kode_opd}
                    tahun={String(branding?.tahun?.value) || ""}
                    Data={DataModal}
                    kode={kode}
                    menu={menu}
                />
            }
            {ModalPagu &&
                <ModalAnggaranMatrixRenja
                    isOpen={ModalPagu}
                    onClose={() => handleModalPagu(0)}
                    onSuccess={fetchTrigger}
                    kode_opd={kode_opd}
                    tahun={String(branding?.tahun?.value)}
                    pagu={Pagu}
                    kode={kode}
                />
            }
        </>
    )
}

interface TablePagu {
    tahun: string;
    pagu_total: number;
}

export const TableTotalPagu: React.FC<TablePagu> = ({ tahun, pagu_total }) => {

    function formatRupiah(angka: number) {
        if (typeof angka !== 'number') {
            return String(angka); // Jika bukan angka, kembalikan sebagai string
        }
        return angka.toLocaleString('id-ID'); // 'id-ID' untuk format Indonesia
    }

    return (
        <table className="w-full">
            <tbody>
                <tr>
                    <td rowSpan={2} className={`border-r border-b px-6 py-4 font-semibold`}>Total Pagu OPD</td>
                    <td className="border-r border-b px-6 py-4 font-semibold text-center">{tahun || "tahun"}</td>
                </tr>
                <tr>
                    <td className="border-r border-b px-6 py-4 font-semibold text-center">Rp.{formatRupiah(pagu_total)}</td>
                </tr>
            </tbody>
        </table>
    )
}
