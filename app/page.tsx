// app/page.tsx
'use client';
import Navbar from '@/components/Navbar';
import '../styles/globals.css';
import HomePage from '../components/pages/HomePage';

export default function Page() {
  return (
    <>
      <Navbar />
      <HomePage />
    </>
  );
}
