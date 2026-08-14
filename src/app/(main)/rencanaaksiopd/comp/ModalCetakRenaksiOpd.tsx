'use client'

import { ButtonRed } from "@/components/global/Button";
import { TbX, TbPrinter } from "react-icons/tb";
import DocumentRenaksiOpd from "./cetak/Document-Renaksi-Opd";
import { PDFViewer } from "@react-pdf/renderer";
import { RencanaKinerja, IndikatorSasaranOpd } from "../type";

interface Modal {
    isOpen: boolean;
    onClose: () => void;
    Data: RencanaKinerja[];
    sasaran: string;
    indikator: IndikatorSasaranOpd[];
    nama_opd: string;
    tahun: number;
}

const ModalCetakRenaksiOpd: React.FC<Modal> = ({ isOpen, onClose, Data, sasaran, indikator, nama_opd, tahun }) => {

    if (!isOpen) {
        return null;
    } else {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={onClose}></div>
                <div className={`bg-white rounded-lg z-10 w-[70%] min-h-[98%] max-h-[98%] text-start overflow-y-hidden`}>
                    <div className="flex items-center justify-between gap-1 bg-emerald-500 p-3">
                        <h1 className="flex items-center gap-1 uppercase text-center font-bold text-white">
                            <TbPrinter />
                            Cetak Rencana Aksi OPD
                        </h1>
                        <div className="flex items-center gap-1">
                            <ButtonRed onClick={onClose}>
                                <TbX />
                            </ButtonRed>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '100vh' }}>
                        <PDFViewer width="100%" height="100%">
                            <DocumentRenaksiOpd
                                Data={Data}
                                sasaran={sasaran}
                                nama_opd={nama_opd}
                                tahun={tahun}
                                indikator={indikator}
                            />
                        </PDFViewer>
                    </div>
                </div>
            </div>
        )
    }
}

export default ModalCetakRenaksiOpd;