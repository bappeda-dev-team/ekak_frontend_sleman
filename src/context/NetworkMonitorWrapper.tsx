'use client';

import dynamic from 'next/dynamic';

const NetworkMonitor = dynamic(() => import('./NetworkMonitor'), {
  ssr: false,
});

export default function NetworkMonitorWrapper() {
  return <NetworkMonitor />;
}