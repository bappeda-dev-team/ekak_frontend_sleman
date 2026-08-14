'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import Select from 'react-select';
import { LoadingButtonClip } from "@/components/global/Loading";
import { TbCirclePlus, TbCircleX } from "react-icons/tb";
import { useBrandingContext } from "@/context/BrandingContext";
import { FormValue, BidangUrusanOption } from "../type";
import { OptionTypeString } from "@/types";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    kode_opd: string;
    onSuccess: () => void;
}

export const ModalBidangUrusanOpd: React.FC<ModalProps> = ({ isOpen, onClose, kode_opd, onSuccess }) => {

    const { control, handleSubmit, reset } = useForm<FormValue>();

    const [BidangUrusan, setBidangUrusan] = useState<OptionTypeString[]>([]);

    const [LoadingOption, setLoadingOption] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();
    const { branding } = useBrandingContext();

    const handleClose = () => {
        setBidangUrusan([]);
        onClose();
        reset();
    };

    const fetchBidangUrusan = async () => {
        setLoadingOption(true);
        try {
            const response = await fetch(`${branding?.api_perencanaan}/bidang_urusan/findall`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('error fetch option master bidang urusan dengan response !ok');
            }
            const result = await response.json();
            const hasil = result.data;
            const data = hasil.map((item: BidangUrusanOption) => ({
                value: `${item.kode_bidang_urusan}`,
                label: `(${item.kode_bidang_urusan}) - ${item.nama_bidang_urusan}`,
            }));
            setBidangUrusan(data);
        } catch (err) {
            console.log('error saat fetch option Master bidang urusan', err);
        } finally {
            setLoadingOption(false);
        }
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formData = {
            //key : value
            kode_bidang_urusan: data.kode_bidang_urusan?.value,
            kode_opd: kode_opd,
        };
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${branding?.api_perencanaan}/bidang_urusan_opd/create`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.code === 200) {
                AlertNotification("Berhasil", `Berhasil menambahkan Bidang Urusan untuk opd`, "success", 1000);
                onClose();
                onSuccess();
            } else {
                console.log(result);
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "Cek koneksi internet / terdapat kesalahan pada server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10">
            <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
            <div className="bg-white rounded-lg p-8 z-10 w-3/5 max-h-[80%] text-start">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-max-[500px] py-2 border-b font-bold text-center">
                        Tambah Bidang Urusan
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="kode_bidang_urusan"
                        >
                            Bidang Urusan :
                        </label>
                        <Controller
                            name="kode_bidang_urusan"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Select
                                        {...field}
                                        placeholder="Pilih Bidang Urusan dari Data Master"
                                        options={BidangUrusan}
                                        isLoading={LoadingOption}
                                        isSearchable
                                        isClearable
                                        onMenuOpen={() => {
                                            if(BidangUrusan?.length === 0){
                                                fetchBidangUrusan();
                                            }
                                        }}
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                            }),
                                            menuPortal: (base) => ({
                                                ...base, zIndex: 9999
                                            })
                                        }}
                                    />
                                </>
                            )}
                        />
                    </div>
                    <ButtonSky type="submit" className="w-full my-3" disabled={Proses}>
                        {Proses ?
                            <span className="flex items-center gap-1">
                                <LoadingButtonClip />
                                Menambahkan
                            </span>
                            :
                            <span className="flex items-center gap-1">
                                <TbCirclePlus />
                                Simpan
                            </span>
                        }
                    </ButtonSky>
                    <ButtonRed type="button" className="w-full my-3 flex items-center gap-1" onClick={handleClose} disabled={Proses}>
                        <TbCircleX />
                        Batal
                    </ButtonRed>
                </form>
            </div>
        </div>
    );
};
