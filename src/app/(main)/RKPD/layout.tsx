'use client'

import { useBrandingContext } from "@/context/BrandingContext";
import { IsLoadingBranding } from "@/components/global/Loading";
import { TahunNull } from "@/components/global/OpdTahunNull";

interface RKPDLayoutProps {
    children: React.ReactNode;
}

export default function RKPDLayout({
    children
}: RKPDLayoutProps) {

    const { LoadingBranding, branding } = useBrandingContext();

    if (LoadingBranding) {
        return <IsLoadingBranding />;
    } else {
        if(branding?.tahun?.value === undefined || branding?.tahun?.value === null){
            return <TahunNull />
        } else {
            return <>{children}</>
        }
    }
}