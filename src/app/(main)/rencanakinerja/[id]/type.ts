export interface FindallRincianRekin {
    rencana_kinerja: RencanaKinerja[];
    rencana_aksis: Renaksi[];
    usulan: null;
    subkegiatan: SubKegiatan[];
    permasalahan: null;
    dasar_hukum: DasarHukum[];
    gambaran_umum: GambaranUmum[];
    inovasi: null;
}

export interface RencanaKinerja {
    id_rencana_kinerja: string;
    id_pohon: number;
    perlu_ubah_pokin: boolean;
    nama_pohon: string;
    nama_rencana_kinerja: string;
    tahun: string;
    status_rencana_kinerja: string;
    operasional_daerah: {
        kode_opd: string;
        nama_opd: string;
    }
    pegawai_id: string;
    nama_pegawai: string;
    indikator: indikator[];
}
export interface indikator {
    id_indikator: string;
    rencana_kinerja_id: string;
    nama_indikator: string;
    targets: targets[];
}
export interface targets {
    id_target: string;
    indikator_id: string;
    target: string;
    satuan: string;
}

export interface SubKegiatan {
    subkegiatanterpilih_id: string;
    id: string;
    rekin_id: string;
    status: string;
    kode_subkegiatan: string;
    nama_sub_kegiatan: string;
}

export interface DasarHukum {
    id: string;
    peraturan_terkait: string;
    uraian: string;
    urutan: number;
}

export interface GambaranUmum {
    id: string;
    gambaran_umum: string;
}

export interface Renaksi {
    id: string;
    rekin_id: string;
    kode_opd: string;
    urutan: number;
    nama_rencana_aksi: string;
    pelaksanaan: Pelaksanaan[];
    jumlah_bobot: number;
}
export interface Pelaksanaan {
    id: string;
    rencana_aksi_id: string;
    bulan: number;
    bobot: number;
}
export interface TotalPerBulan {
    bulan: number;
    total_bobot: number;
}