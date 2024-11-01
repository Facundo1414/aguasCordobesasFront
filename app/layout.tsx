// app/layout.tsx
"use client"
import { fonts } from './fonts';
import { Providers } from './providers';
import '../styles/globals.css';
import Breadcrumbs from '@/components/extra/Breadcrums';
import Navbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  const pathname = usePathname();

  // Verifica si la ruta actual es '/login' para ocultar el Navbar
  const showNavbar = pathname !== '/login-page';

  return (
    <html lang='en' className={fonts.montserrat.variable}>
      <body style={{ fontFamily: 'var(--font-montserrat)' }}>
        <Providers>
          {showNavbar && <Navbar />}
          <Breadcrumbs />
          {children}
        </Providers>
      </body>
    </html>
  );
}
