// app/page.tsx
'use client';
import dynamic from 'next/dynamic';
import ClientCheck from '@/components/ClientCheck';

const DynamicDashboard = dynamic(() => import('@/components/Dashboard'), { ssr: false });

export default function Page() {
  return (
    <ClientCheck>
      <DynamicDashboard />
    </ClientCheck>
  );
}
