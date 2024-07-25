// app/page.tsx
'use client';
import dynamic from 'next/dynamic';

const DynamicDashboard = dynamic(() => import('@/components/Dashboard'), { ssr: false });

export default function Page() {
  return (
    <>
      <DynamicDashboard ></DynamicDashboard>
    </>
  );
}
