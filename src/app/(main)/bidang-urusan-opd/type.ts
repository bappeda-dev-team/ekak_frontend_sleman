import { OptionTypeString } from "@/types";

export interface FormValue {
    kode_bidang_urusan: OptionTypeString | null;
    kode_opd: string;
}

export interface BidangUrusanOption {
    id: string;
    kode_bidang_urusan: string;
    nama_bidang_urusan: string;
    tahun: string;
}
export interface BidangUrusanFindall {
    id: number;
    kode_bidang_urusan: string;
    nama_bidang_urusan: string;
}