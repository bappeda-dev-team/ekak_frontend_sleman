'use client'

import { ButtonBlackBorder } from "@/components/global/Button";
import { TbPrinter } from "react-icons/tb";
import { useParams } from "next/navigation";
import { PohonLaporanOpd } from "./comp/PohonLaporanOpd";
import PohonTujuanOpd from "../pokin-tujuan-opd/comp/PohonTujuanOpd";
import React, { useState, useEffect, useRef } from "react";
import { getToken, getUser, getOpdTahun } from "@/components/lib/Cookie";
import { LoadingClip } from "@/components/global/Loading";
import { LoadingButtonClip } from "@/components/global/Loading";
import html2canvas from "html2canvas";

const CetakCascadingOpdTujuan = () => {

    const { id } = useParams();
    const [Pohon, setPohon] = useState<any>(null);
    const [Loading, setLoading] = useState<boolean>(true);
    const [LoadingCetak, setLoadingCetak] = useState<boolean>(false);

    const [User, setUser] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);

    const kode_opd = User?.roles == "super_admin" ? SelectedOpd?.value : User?.kode_opd;
    const nama_opd = User?.roles == "super_admin" ? SelectedOpd?.label : User?.nama_opd;
    const tahun = Tahun?.value;

    const token = getToken();
    const modalRef = useRef<HTMLDivElement | null>(null);
    const linkDownload = Pohon === null ? `pohon-kosong` : `Pohon Tujuan OPD ${nama_opd} - ${tahun}`

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
        if (data.opd) {
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    }, []);

    const handleDownloadPdf = async () => {
        if (!modalRef.current) return;

        const elementsToHide = document.querySelectorAll(".hide-on-capture") as NodeListOf<HTMLElement>;
        elementsToHide.forEach((el) => (el.style.display = "none"));

        try {
            setLoadingCetak(true);
            const element = modalRef.current;
            const canvas = await html2canvas(element, {
                scale: 1, // Higher scale for better quality
                // width: element.scrollWidth + 50, // Use full scrollable width
                // height: element.scrollHeight + 250, // Use full scrollable height
                windowWidth: element.scrollWidth + 250, // Force full width rendering
                windowHeight: element.scrollHeight + 250, // Force full height rendering
                // useCORS: true, // For cross-origin images
            });

            // Create a new canvas with extra padding
            const paddingTop = 50 // Extra padding for the top of the canvas
            const newCanvas = document.createElement("canvas");
            newCanvas.width = canvas.width;
            newCanvas.height = canvas.height + paddingTop;

            const ctx = newCanvas.getContext("2d");
            if (ctx) {
                ctx.fillStyle = "white"; // Optional: Background color
                ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
                ctx.drawImage(canvas, 0, paddingTop);

                //hitung posisi horizontal untuk centering
                const horizontalOffset = (newCanvas.width - canvas.width) / 2;

                // Gambar canvas di tengah horizontal
                ctx.drawImage(canvas, horizontalOffset, paddingTop);
            }

            const imgData = newCanvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = imgData;
            link.download = linkDownload;
            link.click();
        } catch (error) {
            alert("Error capturing the element");
            console.error("Error capturing the element:", error);
        } finally {
            // Ensure elements are restored even if an error occurs
            elementsToHide.forEach((el) => (el.style.display = ""));
            setLoadingCetak(false);
        }
    };

    useEffect(() => {
        const fetchPohonOpd = async () => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            setLoading(true);
            try {
                let url = `${API_URL}/cascading_opd/findall/${kode_opd}/${tahun}`;
                const response = await fetch(`${url}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                if (result.code === 200) {
                    setPohon(result.data);
                } else {
                    setPohon(null);
                }
            } catch (err) {
                alert("error saat menampilkan pohon opd cetak")
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        if (kode_opd != undefined && tahun != undefined) {
            fetchPohonOpd();
        }
    }, [id, token, kode_opd, tahun]);

    if (Loading) {
        return <LoadingClip />
    } else {
        return (
            <div className="flex flex-col p-1">
                <div className="flex items-center gap-1">
                    <ButtonBlackBorder
                        className="w-full flex items-center gap-1"
                        onClick={handleDownloadPdf}
                    >
                        {LoadingCetak ?
                            <>
                                <LoadingButtonClip />
                                Loading
                            </>
                            :
                            <>
                                <TbPrinter />
                                Download
                            </>
                        }
                    </ButtonBlackBorder>
                </div>
                {Pohon === null ?
                    <h1>Pohon Tidak Tersedia</h1>
                    :
                    <div ref={modalRef} className="tf-tree text-center mt-3">
                        <ul>
                            <li>
                                <PohonTujuanOpd
                                    kode_opd={kode_opd}
                                    nama_opd={nama_opd}
                                    tahun={tahun}
                                    tujuan={Pohon?.tujuan_opd}
                                />
                                {Pohon?.childs &&
                                    <ul>
                                        {Pohon?.childs.map((item: any, index: number) => (
                                            <React.Fragment>
                                                <PohonLaporanOpd tema={item} />
                                            </React.Fragment>
                                        ))}
                                    </ul>
                                }
                            </li>
                        </ul>
                    </div>
                }
            </div>
        )
    }
}

export default CetakCascadingOpdTujuan;