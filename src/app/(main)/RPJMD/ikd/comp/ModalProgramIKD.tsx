'use client'

import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";
import Select from 'react-select';
import { OptionType } from "@/types";
import { ProgramOPD, IkdFindall } from "../type";
import { AlertNotification } from "@/components/global/Alert";
import { useBrandingContext } from "@/context/BrandingContext";

interface FormValue {
    pohon_kinerja_id: number;
    program_opd_id: OptionType | null;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    Data: IkdFindall | null;
    kode_opd: string;
    onSuccess: (data: ProgramOPD) => void;
}

export const ModalProgramIKD: React.FC<modal> = ({ isOpen, onClose, Data, kode_opd, onSuccess }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValue>({
        defaultValues: {
            pohon_kinerja_id: Data?.id,
            program_opd_id: null,
        }
    });
    const { branding } = useBrandingContext();

    const ConvertedOptionProgram = Data?.program_opd.map((o: ProgramOPD) => ({
        value: o.id,
        label: o.nama_program,
    }))

    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    const handleClose = () => {
        reset();
        onClose();
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formData = {
            //key : value
            pohon_kinerja_id: Data?.id,
            program_opd_id: data.program_opd_id?.value,
        };
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${branding?.api_perencanaan}/ikd/select_program_opd/create`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.code === 201) {
                AlertNotification("Berhasil", "Berhasil menambahkan Permasalahan", "success", 1000);
                onSuccess(result.data);
                onClose();
            } else {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-4/5 text-start`}>
                    <div className="w-max-[500px] py-2 border-b text-center">
                        <h1 className="text-xl uppercase">program IKD</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="program_opd_id"
                            >
                                Program OPD:
                            </label>
                            <Controller
                                name="program_opd_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        id="program_opd_id"
                                        placeholder="Pilih Program"
                                        options={ConvertedOptionProgram}
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                                borderColor: 'black',
                                                '&:hover': {
                                                    borderColor: '#3673CA',
                                                },
                                            }),
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col mb-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Nama Pohon
                            </label>
                            <div className="flex flex-col items-start gap-1">
                                <div className="w-full border px-4 py-2 rounded-lg border-gray-700 bg-gray-100">{Data?.nama_pohon || "-"}</div>
                                <JenisPohon jenis_pohon={Data?.jenis_pohon || ""} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <ButtonSky className="w-full" type="submit" disabled={Proses}>
                                {Proses ?
                                    <span className="flex">
                                        <LoadingButtonClip />
                                        Menyimpan...
                                    </span>
                                    :
                                    "Simpan"
                                }
                            </ButtonSky>
                            <ButtonRed className="w-full" onClick={handleClose}>
                                Batal
                            </ButtonRed>
                        </div>
                    </form>
                </div >
            </div >
        )
    }
}

interface jenisPohon {
    jenis_pohon: string;
}
export const JenisPohon: React.FC<jenisPohon> = ({ jenis_pohon }) => {
    return (
        <div
            className={`border px-4 py-2 rounded-lg
                ${(jenis_pohon === "Strategic" || jenis_pohon === "Strategic Pemda") && 'border-red-700 text-red-500 bg-red-200'}
                ${(jenis_pohon === "Tactical" || jenis_pohon === "Tactical Pemda") && 'border-blue-700 text-blue-500 bg-blue-200'}
                ${(jenis_pohon === "Operational" || jenis_pohon === "Operational Pemda") && 'border-green-700 text-green-500 bg-green-200'}
                ${jenis_pohon === "Operational N" && 'border-green-700 text-green-500'}
            `}
        >
            {jenis_pohon || "-"}
        </div>
    )
}