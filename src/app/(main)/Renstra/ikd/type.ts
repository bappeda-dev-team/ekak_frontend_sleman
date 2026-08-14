export interface Pelaksana {
    id: string;
    pegawai_id: string;
    nip: string; // Bisa string kosong sesuai data
    nama_pegawai: string;
}

export interface TargetIndikator {
    id: string;
    indikator_id: string;
    tahun: string;
    target: string; // "WTP"
    satuan: string; // "Opini"
}

export interface IndikatorSasaran {
    id: string;
    indikator: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: TargetIndikator[];
}

export interface SasaranOPD {
    id: number;
    id_pohon: number;
    nama_sasaran_opd: string;
    id_tujuan_opd: number;
    nama_tujuan_opd: string;
    tahun_awal: string;
    tahun_akhir: string;
    jenis_periode: string;
    indikator: IndikatorSasaran[];
}

export interface ProgramOPD {
    id: number;
    tactical_id: number;
    parent: number;
    nama_program: string;
}

export interface IkdFindall {
    id: number;
    nama_pohon: string;
    parent: number;
    jenis_pohon: string;
    level_pohon: number;
    kode_opd: string;
    keterangan: string;
    keterangan_crosscutting: string;
    tahun: string;
    status: string;
    is_active: boolean;
    pelaksana: Pelaksana[];
    sasaran_opd: SasaranOPD[];
    program_opd: ProgramOPD[];
    program_opd_terpilih: ProgramOPD[];
}