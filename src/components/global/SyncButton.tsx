import { ButtonBlack } from "./Button";
import { GoSync } from "react-icons/go";

interface SyncDataProps {
    loading: boolean;
    onSync: () => void;
}

export function SyncDataMasterOpd({ loading, onSync }: SyncDataProps) {
    return (
        <ButtonBlack
            className="flex items-center justify-center"
            onClick={onSync}
            disabled={loading}
        >
            <GoSync
                className={`mr-1 ${loading ? "animate-spin" : ""
                    }`}
            />

            {loading
                ? "Syncing OPD SIMPEG..."
                : "Sync OPD SIMPEG"}
        </ButtonBlack>
    )
}

export function SyncDataMasterJabatan({ loading, onSync }: SyncDataProps) {
    return (
        <ButtonBlack
            className="flex items-center justify-center"
            onClick={onSync}
            disabled={loading}
        >
            <GoSync
                className={`mr-1 ${loading ? "animate-spin" : ""
                    }`}
            />

            {loading
                ? "Syncing Jabatan SIMPEG..."
                : "Sync Jabatan SIMPEG"}
        </ButtonBlack>
    )
}

export function SyncDataMasterPegawai({ loading, onSync }: SyncDataProps) {
    return (
        <ButtonBlack
            className="flex items-center justify-center"
            onClick={onSync}
            disabled={loading}
        >
            <GoSync
                className={`mr-1 ${loading ? "animate-spin" : ""
                    }`}
            />

            {loading
                ? "Syncing Pegawai SIMPEG..."
                : "Sync Pegawai SIMPEG"}
        </ButtonBlack>
    )
}
