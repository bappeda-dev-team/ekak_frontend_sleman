'use client'

// @ts-ignore: allow side-effect CSS import without type declarations
import "../../treeFlexCetak.css";
import React, { useState } from 'react';

interface pohon {
    tema: any;
}

export const PohonOpdCetak: React.FC<pohon> = ({ tema }) => {

    const [childPohons, setChildPohons] = useState(tema.childs || []);

    return (
        <li>
            <>
                <div className={`tf-nc tf flex flex-col w-[600px] rounded-lg
                                ${tema.jenis_pohon === "Strategic Pemda" && 'shadow-slate-500'}
                                ${tema.jenis_pohon === "Tactical Pemda" && 'shadow-slate-500'}
                                ${tema.jenis_pohon === "OperationalPemda" && 'shadow-slate-500'}
                                ${tema.jenis_pohon === "Strategic" && 'shadow-red-500 bg-red-700'}
                                ${tema.jenis_pohon === "Tactical" && 'shadow-blue-500 bg-blue-500'}
                                ${tema.jenis_pohon === "Operational" && 'shadow-green-500 bg-green-500'}
                                ${tema.jenis_pohon === "Operational N" && 'shadow-slate-500 bg-white'}
                                ${(tema.jenis_pohon === "Strategic Crosscutting" || tema.jenis_pohon === "Tactical Crosscutting" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohon === "Operational N Crosscutting") && 'shadow-yellow-700 bg-yellow-700'}
                            `}
                >
                    {/* HEADER */}
                    <div
                        className={`flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 rounded-lg bg-white
                                    ${tema.jenis_pohon === "Tematik" && 'border-black'}
                                    ${tema.jenis_pohon === "Sub Tematik" && 'border-black'}
                                    ${tema.jenis_pohon === "Sub Sub Tematik" && 'border-black'}
                                    ${tema.jenis_pohon === "Super Sub Tematik" && 'border-black'}
                                    ${tema.jenis_pohon === "Strategic" && 'border-red-500 text-red-700'}
                                    ${tema.jenis_pohon === "Tactical" && 'border-blue-500 text-blue-500'}
                                    ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational N") && 'border-green-500 text-green-500'}
                                    ${tema.jenis_pohon === "Strategic Pemda" && 'border-red-700 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                                    ${tema.jenis_pohon === "Tactical Pemda" && 'border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                                    ${tema.jenis_pohon === "Operational Pemda" && 'border-green-500 text-white bg-gradient-to-r from-[#139052] from-40% to-[#2DCB06]'}
                                `}
                    >
                        <div className="flex flex-wrap items-center justify-center gap-1">
                            <h1>{tema.jenis_pohon} {tema.id}</h1>
                            {tema.is_active === false &&
                                <button className="px-2 bg-red-600 text-white rounded-xl cursor-default">NON-AKTIF</button>
                            }
                        </div>
                    </div>
                    {/* BODY */}
                    <div className="flex justify-center my-3">
                        <TablePohon item={tema} />
                    </div>
                </div>
            </>
            <ul>
                {childPohons.map((dahan: any, index: any) => (
                    dahan.level_pohon > 4 ?
                        <></>
                        :
                        <React.Fragment key={index}>
                            <PohonOpdCetak tema={dahan} />
                        </React.Fragment>
                ))}
            </ul>
        </li>
    )
}

export const TablePohon = (props: any) => {
    const tema = props.item.tema;
    const nama_pohon = props.item.nama_pohon;
    const keterangan = props.item.keterangan;
    const jenis = props.item.jenis_pohon;
    const indikator = props.item.indikator;
    return (
        <div className="flex flex-col w-full">
            <table className='w-full'>
                <tbody>
                    <tr>
                        <td
                            className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-tl-lg
                                ${jenis === "Tematik" && "border-black"}
                                ${jenis === "Sub Tematik" && "border-black"}
                                ${jenis === "Sub Sub Tematik" && "border-black"}
                                ${jenis === "Super Sub Tematik" && "border-black"}
                                ${jenis === "Strategic Pemda" && "border-black"}
                                ${jenis === "Tactical Pemda" && "border-black"}
                                ${jenis === "Operational Pemda" && "border-black"}
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                            `}
                        >
                            {(jenis === 'Tematik' || jenis === 'Sub Tematik' || jenis === 'Sub Sub Tematik' || jenis === 'Super Sub Tematik') && 'Tema'}
                            {(jenis === 'Strategic' || jenis === 'Strategic Pemda') && 'Strategic'}
                            {(jenis === 'Tactical' || jenis === 'Tactical Pemda') && 'Tactical'}
                            {(jenis === 'Operational' || jenis === 'Operational Pemda') && 'Operational'}
                            {jenis === 'Operational N' && 'Operational N'}
                        </td>
                        <td
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-tr-lg
                                ${jenis === "Tematik" && "border-black"}
                                ${jenis === "Sub Tematik" && "border-black"}
                                ${jenis === "Sub Sub Tematik" && "border-black"}
                                ${jenis === "Super Sub Tematik" && "border-black"}
                                ${jenis === "Strategic Pemda" && "border-black"}
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical Pemda" && "border-black"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${jenis === "Operational Pemda" && "border-black"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                            `}
                        >
                            {tema ? tema : nama_pohon ? nama_pohon : "-"}
                        </td>
                    </tr>
                    {indikator ?
                        indikator.map((data: any, index: number) => (
                            <React.Fragment key={data.id_indikator}>
                                <tr>
                                    <td
                                        className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Tematik" && "border-black"}
                                        ${jenis === "Sub Tematik" && "border-black"}
                                        ${jenis === "Sub Sub Tematik" && "border-black"}
                                        ${jenis === "Super Sub Tematik" && "border-black"}
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}
                                    `}
                                    >
                                        {indikator.length > 1 ?
                                            <p>Indikator {index + 1}</p>
                                            :
                                            <p>Indikator</p>
                                        }
                                    </td>
                                    <td
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Tematik" && "border-black"}
                                        ${jenis === "Sub Tematik" && "border-black"}
                                        ${jenis === "Sub Sub Tematik" && "border-black"}
                                        ${jenis === "Super Sub Tematik" && "border-black"}
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}
                                    `}
                                    >
                                        {data.nama_indikator ? data.nama_indikator : "-"}
                                    </td>
                                </tr>
                                {data.targets ?
                                    data.targets.map((data: any) => (
                                        <tr key={data.id_target}>
                                            <td
                                                className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Tematik" && "border-black"}
                                                ${jenis === "Sub Tematik" && "border-black"}
                                                ${jenis === "Sub Sub Tematik" && "border-black"}
                                                ${jenis === "Super Sub Tematik" && "border-black"}
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${jenis === "Strategic Pemda" && "border-black"}
                                                ${jenis === "Tactical Pemda" && "border-black"}
                                                ${jenis === "Operational Pemda" && "border-black"}    
                                            `}
                                            >
                                                {indikator.length > 1 ?
                                                    <p>Target/Satuan {index + 1}</p>
                                                    :
                                                    <p>Target/Satuan</p>
                                                }
                                            </td>
                                            <td
                                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Tematik" && "border-black"}
                                                ${jenis === "Sub Tematik" && "border-black"}
                                                ${jenis === "Sub Sub Tematik" && "border-black"}
                                                ${jenis === "Super Sub Tematik" && "border-black"}
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${jenis === "Strategic Pemda" && "border-black"}
                                                ${jenis === "Tactical Pemda" && "border-black"}
                                                ${jenis === "Operational Pemda" && "border-black"}    
                                            `}
                                            >
                                                {data.target ? data.target : "-"} / {data.satuan ? data.satuan : "-"}
                                            </td>
                                        </tr>
                                    ))
                                    :
                                    <tr>
                                        <td
                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Tematik" && "border-black"}
                                                ${jenis === "Sub Tematik" && "border-black"}
                                                ${jenis === "Sub Sub Tematik" && "border-black"}
                                                ${jenis === "Super Sub Tematik" && "border-black"}
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${jenis === "Strategic Pemda" && "border-black"}
                                                ${jenis === "Tactical Pemda" && "border-black"}
                                                ${jenis === "Operational Pemda" && "border-black"}    
                                            `}
                                        >
                                            -
                                        </td>
                                        <td
                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Tematik" && "border-black"}
                                                ${jenis === "Sub Tematik" && "border-black"}
                                                ${jenis === "Sub Sub Tematik" && "border-black"}
                                                ${jenis === "Super Sub Tematik" && "border-black"}
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${jenis === "Strategic Pemda" && "border-black"}
                                                ${jenis === "Tactical Pemda" && "border-black"}
                                                ${jenis === "Operational Pemda" && "border-black"}    
                                            `}
                                        >
                                            -
                                        </td>
                                    </tr>
                                }
                            </React.Fragment>
                        ))
                        :
                        <>
                            <tr>
                                <td
                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Tematik" && "border-black"}
                                        ${jenis === "Sub Tematik" && "border-black"}
                                        ${jenis === "Sub Sub Tematik" && "border-black"}
                                        ${jenis === "Super Sub Tematik" && "border-black"}
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}
                                    `}
                                >
                                    Indikator
                                </td>
                                <td
                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Tematik" && "border-black"}
                                        ${jenis === "Sub Tematik" && "border-black"}
                                        ${jenis === "Sub Sub Tematik" && "border-black"}
                                        ${jenis === "Super Sub Tematik" && "border-black"}
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}
                                    `}
                                >
                                    -
                                </td>
                            </tr>
                            <tr>
                                <td
                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Tematik" && "border-black"}
                                        ${jenis === "Sub Tematik" && "border-black"}
                                        ${jenis === "Sub Sub Tematik" && "border-black"}
                                        ${jenis === "Super Sub Tematik" && "border-black"}
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}    
                                    `}
                                >
                                    Target/Satuan
                                </td>
                                <td
                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Tematik" && "border-black"}
                                        ${jenis === "Sub Tematik" && "border-black"}
                                        ${jenis === "Sub Sub Tematik" && "border-black"}
                                        ${jenis === "Super Sub Tematik" && "border-black"}
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}    
                                    `}
                                >
                                    -
                                </td>
                            </tr>
                        </>
                    }
                    <tr>
                        <td
                            className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-bl-lg
                                ${jenis === "Tematik" && "border-black"}
                                ${jenis === "Sub Tematik" && "border-black"}
                                ${jenis === "Sub Sub Tematik" && "border-black"}
                                ${jenis === "Super Sub Tematik" && "border-black"}
                                ${jenis === "Strategic Pemda" && "border-black"}
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical Pemda" && "border-black"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${jenis === "Operational Pemda" && "border-black"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}    
                            `}
                        >
                            Keterangan
                        </td>
                        <td
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-br-lg
                                ${jenis === "Tematik" && "border-black"}
                                ${jenis === "Sub Tematik" && "border-black"}
                                ${jenis === "Sub Sub Tematik" && "border-black"}
                                ${jenis === "Super Sub Tematik" && "border-black"}
                                ${jenis === "Strategic Pemda" && "border-black"}
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical Pemda" && "border-black"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${jenis === "Operational Pemda" && "border-black"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}    
                            `}
                        >
                            {keterangan ? keterangan : "-"}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
