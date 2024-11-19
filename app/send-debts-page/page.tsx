// app/SendDebtsPage-page/page.tsx
'use client';

import SendDebtsPage from "@/components/pages/SendDebtsPage";
import { useAuthProtection } from "../useAuthProtection";

export default function SendDebtsPageRoute() {
  useAuthProtection();


  return (
    <>
      <SendDebtsPage/>
    </>
  );
}
