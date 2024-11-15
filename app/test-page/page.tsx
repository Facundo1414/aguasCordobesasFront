// app/test-page/page.tsx
'use client';

import TestPage from "@/components/pages/TestPage";
import { useAuthProtection } from "../useAuthProtection";

export default function TestPageRoute() {
  useAuthProtection();

  return (
    <>
      <TestPage/>
    </>
  );
}
