// app/NetworkToastMonitor.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useNetworkState } from '@uidotdev/usehooks';
import useToast from '@/components/global/Toast';

export default function NetworkMonitor() {
    const network = useNetworkState();
    const { toastSuccess, toastError, toastWarning } = useToast();

    const wasOnline = useRef<boolean | null>(null);
    const wasSlow = useRef<boolean | null>(null);

    useEffect(() => {
        if (typeof network.online !== 'boolean') return;

        // Supaya tidak muncul toast saat halaman pertama kali dibuka.
        if (wasOnline.current === null) {
            wasOnline.current = network.online;
            return;
        }

        if (!network.online && wasOnline.current) {
            toastError('Koneksi internet terputus');
        }

        if (network.online && !wasOnline.current) {
            toastSuccess('Koneksi internet tersambung kembali');
        }

        wasOnline.current = network.online;
    }, [network.online, toastError, toastSuccess]);

    useEffect(() => {
        if (!network.online) return;

        const isSlow =
            network.saveData ||
            network.effectiveType === 'slow-2g' ||
            network.effectiveType === '2g' ||
            network.effectiveType === '3g' ||
            (typeof network.downlink === 'number' &&
                network.downlink > 0 &&
                network.downlink < 1.5) ||
            (typeof network.rtt === 'number' && network.rtt > 700);

        // Supaya toast lambat tidak muncul berulang-ulang.
        if (wasSlow.current === null) {
            wasSlow.current = isSlow;
            return;
        }

        if (isSlow && !wasSlow.current) {
            toastWarning('Koneksi internet sedang lambat');
        }

        wasSlow.current = isSlow;
    }, [
        network.online,
        network.saveData,
        network.effectiveType,
        network.downlink,
        network.rtt,
        toastWarning,
    ]);

    return null;
}