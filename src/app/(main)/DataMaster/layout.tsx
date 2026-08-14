'use client'

import { useEffect, useState } from "react";
import { getUser } from "@/components/lib/Cookie";
import { useBrandingContext } from "@/context/BrandingContext";
import { IsLoadingBranding } from "@/components/global/Loading";
import ForbiddenPage from "@/app/forbidden";

interface DataMasterLayout {
    children: React.ReactNode;
}

export default function DataMasterLayout({
    children
}: DataMasterLayout) {

    const { LoadingBranding } = useBrandingContext();
    const [User, setUser] = useState<any>(null);
    const [LoadingUser, setLoadingUser] = useState<boolean>(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoadingUser(true);
                const user = await getUser();
                if (user) {
                    setUser(user.user);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingUser(false);
            }
        };
        fetchUser();
    }, []);

    if (LoadingBranding || LoadingUser) {
        return <IsLoadingBranding />;
    } else {
        if (User?.roles == "super_admin") {
            return <>{children}</>
        } else {
            return <ForbiddenPage />
        }
    }
}