'use client'

import React, { useState } from "react";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { getToken, getUser } from "@/components/lib/Cookie";
import { AlertNotification } from "@/components/global/Alert";
import { LoadingButtonClip } from "@/components/global/Loading";
import Select from 'react-select';
import { OptionTypeString } from "@/types";
import { IkkFindall, FormValue, Indikator, Target } from "../type";

interface modal {
    isOpen: boolean;
    onClose: () => void;
    Data: IkkFindall | null;
    jenis: 'tambah' | 'edit';
    kode_opd: string;
    tahun: number;
    onSuccess: () => void;
}

export const ModalIkk: React.FC<modal> = ({ isOpen, onClose, jenis, tahun, kode_opd, Data, onSuccess }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>({
        defaultValues: {
            kode_bidang_urusan: Data?.kode_bidang_urusan
                ? {
                    value: Data?.kode_bidang_urusan,
                    label: `(${Data?.kode_bidang_urusan}) ${Data?.nama_bidang_urusan}`
                }
                : null,
            jenis: Data?.jenis
                ? {
                    value: Data?.jenis,
                    label: Data?.jenis
                }
                : null,
            keterangan: Data?.keterangan || '',
            indikators: Data?.indikators?.map((i: Indikator) => ({
                indikator: i.indikator,
                targets: i.targets.map((t: Target) => ({
                    target: t.target,
                    satuan: t.satuan,
                })) 
            }))
            ,
        }
    });

    const { fields } = useFieldArray({
        control,
        name: "indikators",
    });

    const [Proses, setProses] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(false);
    const token = getToken();

    const [OptionBidangUrusan, setOptionBidangUrusan] = useState<OptionTypeString[]>([])

    const fetchOptionBidangUrusan = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/bidang_urusan/findall/${kode_opd}`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            const data = result.data;
            const hasil = data.map((item: any) => ({
                value: item.kode_bidang_urusan,
                label: `${item.kode_bidang_urusan} - ${item.nama_bidang_urusan}`,
            }));
            setOptionBidangUrusan(hasil);
        } catch (err) {
            console.error(err, "gagal fetch option bidang urusan");
        } finally {
            setLoading(false);
        }
    }

    const OptionJenis = [
        { value: "output", label: "output" },
        { value: "outcome", label: "outcome" }
    ]

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            kode_bidang_urusan: data.kode_bidang_urusan?.value,
            jenis: data.jenis?.value,
            kode_opd: kode_opd,
            tahun: tahun,
            keterangan: data.keterangan,
            indikators: data?.indikators.map((i: Indikator) => ({
                indikator: i.indikator,
                targets: i.targets.map((t: Target) => ({
                    target: t.target,
                    satuan: t.satuan
                }))
            }))
        };
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/ikk/create`, {
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
                onSuccess();
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
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={onClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-4/5 text-start`}>
                    <div className="w-max-[500px] py-2 border-b text-center">
                        <h1 className="text-xl uppercase">{jenis} Indikator Kinerja Kunci</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="kode_bidang_urusan"
                            >
                                Bidang Urusan:
                            </label>
                            <Controller
                                name="kode_bidang_urusan"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        id="kode_bidang_urusan"
                                        placeholder="Pilih Bidang Urusan"
                                        options={OptionBidangUrusan}
                                        isLoading={Loading}
                                        onMenuOpen={() => {
                                            fetchOptionBidangUrusan();
                                        }}
                                        styles={{
                                            control: (baseStyles, state) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                                borderColor: 'black', // Warna default border menjadi merah
                                                '&:hover': {
                                                    borderColor: '#3673CA', // Warna border tetap merah saat hover
                                                },
                                            }),
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="jenis"
                            >
                                Jenis:
                            </label>
                            <Controller
                                name="jenis"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        id="jenis"
                                        placeholder="Pilih Jenis"
                                        options={OptionJenis}
                                        isLoading={Loading}
                                        styles={{
                                            control: (baseStyles, state) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                                borderColor: 'black', // Warna default border menjadi merah
                                                '&:hover': {
                                                    borderColor: '#3673CA', // Warna border tetap merah saat hover
                                                },
                                            }),
                                        }}
                                    />
                                )}
                            />
                        </div>
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex flex-col border border-gray-700 my-2 py-2 px-2 rounded-lg">
                                <Controller
                                    name={`indikators.${index}.indikator`}
                                    control={control}
                                    defaultValue={field.indikator}
                                    render={({ field }) => (
                                        <div className="flex flex-col py-3">
                                            <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                Nama Indikator :
                                            </label>
                                            <input
                                                {...field}
                                                className="border px-4 py-2 rounded-lg"
                                                placeholder={`Masukkan nama indikator`}
                                            />
                                        </div>
                                    )}
                                />
                                {field.targets.map((_, subindex) => (
                                    <div key={subindex} className="flex items-center gap-1 w-full">
                                        <Controller
                                            name={`indikators.${index}.targets.${subindex}.target`}
                                            control={control}
                                            defaultValue={_.target}
                                            render={({ field }) => (
                                                <div className="flex flex-col py-3 w-full">
                                                    <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                        Target :
                                                    </label>
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        className="border px-4 py-2 rounded-lg"
                                                        placeholder="Masukkan target"
                                                    />
                                                </div>
                                            )}
                                        />
                                        <Controller
                                            name={`indikators.${index}.targets.${subindex}.satuan`}
                                            control={control}
                                            defaultValue={_.satuan}
                                            render={({ field }) => (
                                                <div className="flex flex-col py-3 w-full">
                                                    <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                        Satuan :
                                                    </label>
                                                    <input
                                                        {...field}
                                                        className="border px-4 py-2 rounded-lg"
                                                        placeholder="Masukkan satuan"
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="keterangan"
                            >
                                Keterangan:
                            </label>
                            <Controller
                                name="keterangan"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="keterangan"
                                        placeholder="masukkan Keterangan"
                                    />
                                )}
                            />
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
                            <ButtonRed className="w-full" onClick={onClose}>
                                Batal
                            </ButtonRed>
                        </div>
                    </form>
                </div >
            </div >
        )
    }
}