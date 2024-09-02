// app/test-page/page.tsx
'use client';

import Navbar from "@/components/Navbar";
import TestPage from "@/components/pages/TestPage";

export default function TestPageRoute() {
  return (
    <>
      <Navbar/>
      <TestPage/>
    </>
  );
}
