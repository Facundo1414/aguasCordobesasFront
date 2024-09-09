// app/sendDebts-page/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import SendDebtsPage from "@/components/pages/SendDebtsPage";

export default function SendDebtsPageRoute() {
  const searchParams = useSearchParams();
  const textFile = searchParams.get('textFile') || ""; // Obtén el parámetro de consulta o usa una cadena vacía por defecto

  return (
    <>
      <SendDebtsPage textFile={textFile}/>
    </>
  );
}
