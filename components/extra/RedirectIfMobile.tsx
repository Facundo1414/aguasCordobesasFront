'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RedirectIfMobile = () => {
  const router = useRouter();

  useEffect(() => {
    const isMobile = window.innerWidth <= 1024; // Tamaño de pantalla móvil o tablet
    if (isMobile) {
      router.push('/not-available-page'); // Redirige a una página alternativa
    }
  }, [router]);

  return null; // Este componente no renderiza nada
};

export default RedirectIfMobile;
