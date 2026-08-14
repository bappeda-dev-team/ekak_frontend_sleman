'use client'

import { FiHome } from 'react-icons/fi';
import { ButtonGreen, ButtonRed } from '@/components/global/Button';
import Musrebang from './comp/Usulan';
import SubKegiatan from './comp/SubKegiatan';
import Sakip from './comp/Sakip';
import Renaksi from './comp/Renaksi';
import DasarHukum from './comp/DasarHukum';
import GambaranUmum from './comp/GambaranUmum';
import Inovasi from './comp/Inovasi';
import { AlertNotification } from '@/components/global/Alert';
import Permasalahan from './comp/Permasalahan';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser, getOpdTahun } from '@/components/lib/Cookie';
import { TbArrowBack, TbDeviceFloppy } from 'react-icons/tb';
import { getToken } from '@/components/lib/Cookie';
import { FindallRincianRekin } from './type';
import { LoadingClip } from '@/components/global/Loading';

const RincianRencanaKinerja = () => {

    const params = useParams();
    const router = useRouter();
    const id_rekin = params.id as string;
    const token = getToken();

    const [Data, setData] = useState<FindallRincianRekin | null>(null);
    const [Loading, setLoading] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const [User, setUser] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);

    useEffect(() => {
        const fetchUser = getUser();
        const data = getOpdTahun();
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
    }, []);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchSubKegiatan = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/rencana_kinerja/${id_rekin}/pegawai/${User?.nip}/input_rincian_kak`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.rencana_kinerja;
                if (result.code === 200) {
                    setData(hasil[0]);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.log(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        if (User?.nip != undefined) {
            fetchSubKegiatan();
        }
    }, [id_rekin, User, token, FetchTrigger]);

    const handleFetchTrigger = () => {
        setFetchTrigger((prev) => !prev);
    }

    if (Loading) {
        return (
            <>
                <div className="flex items-center">
                    <a href="/" className="mr-1"><FiHome /></a>
                    <p className="mr-1">/ Perencanaan</p>
                    <p className="mr-1">/ Rencana Kinerja</p>
                    <p>/ Rincian Rencana Kinerja</p>
                </div>
                <LoadingClip />
            </>
        )
    }

    return (
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Rencana Kinerja</p>
                <p>/ Rincian Rencana Kinerja</p>
            </div>
            {(User?.roles != 'level_4' && User?.roles != 'level_2') ?
                <>
                    <div className="my-5">
                        <Musrebang
                            id={id_rekin}
                            nip={User?.nip}
                        />
                        <SubKegiatan
                            id_rekin={id_rekin}
                            kode_opd={User?.kode_opd}
                            Data={Data?.subkegiatan || []}
                            onSuccess={handleFetchTrigger}
                        />
                        <Sakip id={id_rekin} />
                        {Data?.subkegiatan === null ?
                            <div className="flex flex-col my-3 border rounded-lg border-red-500 bg-red-200 p-5 gap-1">
                                <h1 className='font-bold'>Sub Kegiatan Belum Di pilih</h1>
                                <h1 className='font-light'>Form Rencana Aksi, Dasar Hukum, Gambaran Umum, Permasalahan akan muncul setelah Sub Kegiatan di pilih</h1>
                            </div>
                            :
                            <>
                                <Renaksi id={id_rekin} />
                                <DasarHukum
                                    id={id_rekin}
                                    nip={User?.nip}
                                />
                                <GambaranUmum
                                    id={id_rekin}
                                    nip={User?.nip}
                                />
                                <Permasalahan
                                    id={id_rekin}
                                    nip={User?.nip}
                                />
                                {/* <Inovasi id={id_rekin}/> */}
                            </>
                        }
                        {Data?.subkegiatan === null ?
                            <ButtonRed
                                onClick={() => {
                                    AlertNotification("Tersimpan", "Data rincian rencana kinerja berhasil disimpan", "success", 2000);
                                    router.push('/rencanakinerja');
                                }}
                                className='w-full flex items-center gap-1'
                            >
                                <TbArrowBack />
                                Kembali
                            </ButtonRed>
                            :
                            <ButtonGreen
                                onClick={() => {
                                    AlertNotification("Tersimpan", "Data rincian rencana kinerja berhasil disimpan", "success", 2000);
                                    router.push('/rencanakinerja');
                                }}
                                className='w-full flex items-center gap-1'
                            >
                                <TbDeviceFloppy />
                                Selesai
                            </ButtonGreen>
                        }
                    </div>
                </>
                :
                <>
                    <Sakip id={id_rekin} />
                    <Renaksi id={id_rekin} />
                    <div className="w-full my-4">
                        <ButtonGreen
                            onClick={() => {
                                AlertNotification("Tersimpan", "Data rincian rencana kinerja berhasil disimpan", "success", 2000);
                                router.push('/rencanakinerja');
                            }}
                            className='w-full flex items-center gap-1'
                        >
                            <TbDeviceFloppy />
                            Selesai
                        </ButtonGreen>
                    </div>
                </>
            }
        </>
    )
}

export default RincianRencanaKinerja;