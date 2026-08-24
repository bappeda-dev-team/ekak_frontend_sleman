import * as jwtDecoded from "jwt-decode";
import { AlertNotification } from "../global/Alert";
import { LoginResponse } from "@/types"

// Fungsi untuk menyimpan nilai ke cookies
export const setCookie = (name: string, value: any) => {
    document.cookie = `${name}=${value}; path=/;`;
};

export const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') {
        // Jika di server-side, kembalikan null atau nilai default lainnya
        return null;
    }

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

export const login = async (
    username: string,
    password: string,
    captcha_id: string,
    captcha_answer: string
): Promise<LoginResponse> => {
    const payload = {
        username,
        password,
        captcha_key: captcha_id,
        captcha_answer,
    };

    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(`${API_URL}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        // Login berhasil
        if (result.code === 200) {
            const token = result.data.token;

            try {
                const decoded = jwtDecoded.jwtDecode(token);

                document.cookie = `token=${token}; path=/;`;
                document.cookie = `user=${JSON.stringify(decoded)}; path=/;`;

                AlertNotification(
                    "Login Berhasil",
                    "",
                    "success",
                    1000
                );

                return {
                    success: true,
                    token,
                    isLocked: false,
                    remainingTime: 0,
                    remainingMinute: 0,
                    remainingSecond: 0,
                };
            } catch (decodeError) {
                console.error(
                    "Error decoding token:",
                    decodeError
                );

                return {
                    success: false,
                    isLocked: false,
                    remainingTime: 0,
                    remainingMinute: 0,
                    remainingSecond: 0,
                    message: "Token login tidak valid",
                };
            }
        }

        // Login gagal
        const loginData = result.data ?? {};

        const isLocked = loginData.is_locked ?? false;
        const remainingTime = loginData.remaining_time ?? 0;
        const remainingMinute = loginData.remaining_minute ?? 0;
        const remainingSecond = loginData.remaining_second ?? 0;

        return {
            success: false,
            isLocked,
            remainingTime,
            remainingMinute,
            remainingSecond,
            message:
                loginData.message ??
                "NIP atau password salah",
        };

    } catch (err) {
        console.error(
            "Login gagal dengan error:",
            err
        );

        AlertNotification(
            "Login Gagal",
            "Terdapat kesalahan server / koneksi internet",
            "error",
            2000
        );

        return {
            success: false,
            isLocked: false,
            remainingTime: 0,
            remainingMinute: 0,
            remainingSecond: 0,
            message:
                "Terdapat kesalahan server / koneksi internet",
        };
    }
};

export const logout = () => {
    // Hapus token dari localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('opd');
    localStorage.removeItem('user');
    localStorage.removeItem('periode');

    // Hapus semua cookie yang terkait
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    document.cookie = 'opd=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';

    // Redirect ke halaman login
    window.location.href = '/login';
};

export const getUser = () => {
    const get_user = getCookie("user");
    if (get_user) {
        return {
            user: JSON.parse(get_user)
        };
    }
}

export const getToken = () => {
    const get_Token = getCookie("token")
    if (get_Token) {
        return get_Token;
    }
    return null;
}

type SelectedValue = {
    value: any
    label?: string
}

type OpdTahunResult = {
    tahun: SelectedValue | null
    opd: SelectedValue | null
    roles: string[] | null
}

export const getOpdTahunNew = (): OpdTahunResult => {
    try {
        const tahunCookie = getCookie("tahun")
        const opdCookie = getCookie("opd")
        const userCookie = getCookie("user")

        const tahun = tahunCookie ? JSON.parse(tahunCookie) : null
        const user = userCookie ? JSON.parse(userCookie) : null
        const roles = user?.roles ?? null

        // DEFAULT
        let opd: SelectedValue | null = null

        if (roles.some((r: string) => ['super_admin'].includes(r))) {
            // super admin pilih dari dropdown → cookie opd
            opd = opdCookie ? JSON.parse(opdCookie) : null
        } else {
            // selain super admin → opd dari user
            opd = user?.kode_opd
                ? { value: user.kode_opd }
                : null
        }

        return { tahun, opd, roles }
    } catch (err) {
        console.error("getOpdTahun error:", err)
        return { tahun: null, opd: null, roles: null }
    }
}

export const getOpdTahun = () => {
    const get_tahun = getCookie("tahun");
    const get_opd = getCookie("opd");

    if (get_tahun && get_opd) {
        return {
            tahun: JSON.parse(get_tahun),
            opd: JSON.parse(get_opd)
        };
    }

    if (get_tahun) {
        return { tahun: JSON.parse(get_tahun), opd: null };
    }

    if (get_opd) {
        return { tahun: null, opd: JSON.parse(get_opd) };
    }

    return { tahun: null, opd: null };
};

export const getPeriode = () => {
    const get_periode = getCookie("periode");

    if (get_periode) {
        return {
            periode: JSON.parse(get_periode)
        };
    } else {
        return { periode: null };
    }

};
