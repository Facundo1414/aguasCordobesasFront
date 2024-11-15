// app/upload-page/page.tsx
'use client';

import UploadPage from "@/components/pages/UploadPage";
import { useAuthProtection } from "../useAuthProtection";

export default function UploadPageRoute() {
  useAuthProtection();


  return (
    <>
      <UploadPage/>
    </>
  );
}
