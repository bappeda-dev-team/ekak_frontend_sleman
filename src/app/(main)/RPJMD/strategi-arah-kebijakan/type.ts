export interface FindallStrategiArahKebijakan {
    isu_strategis_pemdas: IsuStrategisPemda[];
    tujuan_pemda: TujuanPemda[];
    strategi_arah_kebijakan_pemdas: StrategiArahKebijakan[];
}

export interface IsuStrategisPemda {
    nama_isu_strategis: string;
}

export interface TujuanPemda {
    id: number;
    tujuan: string;
}

export interface StrategiArahKebijakan {
    tujuan_pemda: string;
    sasaran_pemdas: SasaranPemda[];
}

export interface SasaranPemda {
    sasaran_pemda: string;
    strategi_pemda: string;
    arah_kebijakan_pemdas: ArahKebijakanPemda[];
}

export interface ArahKebijakanPemda {
    arah_kebijakan_pemda: string;
}