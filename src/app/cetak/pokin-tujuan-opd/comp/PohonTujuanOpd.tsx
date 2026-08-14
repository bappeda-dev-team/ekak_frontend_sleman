import React from "react";

interface PohonTujuanOpd {
    nama_opd: string;
    kode_opd: string;
    tahun: number;
    tujuan: any[];
}

const PohonTujuanOpd: React.FC<PohonTujuanOpd> = ({ nama_opd, kode_opd, tujuan, tahun }) => {
    return (
        <div className="tf-nc tf flex flex-col w-[600px] rounded-lg">
            <div className="header flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black">
                <h1>Pohon Kinerja OPD</h1>
            </div>
            <div className="body flex justify-center my-3">
                <table className="w-full">
                    <tbody>
                        <tr>
                            <td className="min-w-[100px] border px-2 py-3 border-black text-start">Perangkat Daerah</td>
                            <td className="min-w-[300px] border px-2 py-3 border-black text-start">{nama_opd || "opd tidak diketahui"}</td>
                        </tr>
                        <tr>
                            <td className="min-w-[100px] border px-2 py-3 border-black text-start">Kode OPD</td>
                            <td className="min-w-[300px] border px-2 py-3 border-black text-start">{kode_opd || "-"}</td>
                        </tr>
                        {tujuan?.length != 0 ?
                            tujuan.map((item: any) => (
                                <React.Fragment key={item.id}>
                                    <tr>
                                        <td className="min-w-[100px] border px-2 py-3 border-black text-start bg-gray-100">Tujuan OPD</td>
                                        <td className="min-w-[300px] border px-2 py-3 border-black text-start bg-gray-100">{item.tujuan}</td>
                                    </tr>
                                    {item.indikator ?
                                        <React.Fragment>
                                            {item.indikator.map((i: any) => (
                                                <React.Fragment key={item.id}>
                                                    <tr>
                                                        <td className="min-w-[100px] border px-2 py-3 border-black text-start">Indikator</td>
                                                        <td className="min-w-[300px] border px-2 py-3 border-black text-start">{i.indikator}</td>
                                                    </tr>
                                                    {i.targets ?
                                                        i.targets.map((t: any, t_index: number) => (
                                                            <tr key={t_index}>
                                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Target/Satuan</td>
                                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{t.target || "-"} / {t.satuan || "-"}</td>
                                                            </tr>
                                                        ))
                                                        :
                                                        <tr>
                                                            <td className="min-w-[100px] border px-2 py-3 border-black text-start">Target/Satuan</td>
                                                            <td className="min-w-[300px] border px-2 py-3 border-black text-start">-</td>
                                                        </tr>
                                                    }
                                                </React.Fragment>
                                            ))}
                                        </React.Fragment>
                                        :
                                        <tr key={item.id}>
                                            <td className="min-w-[100px] border px-2 py-3 border-black text-start">Indikator</td>
                                            <td className="min-w-[300px] border px-2 py-3 border-black text-start">-</td>
                                        </tr>
                                    }
                                </React.Fragment>
                            ))
                            :
                            <tr>
                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Tujuan OPD</td>
                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">-</td>
                            </tr>
                        }
                        <tr>
                            <td className="min-w-[100px] border px-2 py-3 border-black text-start">Tahun</td>
                            <td className="min-w-[300px] border px-2 py-3 border-black text-start">{tahun || ""}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PohonTujuanOpd;