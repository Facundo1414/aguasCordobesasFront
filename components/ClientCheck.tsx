// components/ClientCheck.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';

const ClientCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Considerar 768px como el límite para móviles
    };

    handleResize(); // Comprobar el tamaño de la pantalla al cargar el componente
    window.addEventListener('resize', handleResize); // Actualizar cuando cambie el tamaño de la pantalla

    return () => {
      window.removeEventListener('resize', handleResize); // Limpiar el evento en el desmontaje
    };
  }, []);

  if (isMobile) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Text fontSize="lg" align="center" color="white">
          Esta página no está disponible en dispositivos móviles.
        </Text>
      </Flex>
    );
  }

  return <>{children}</>;
};

export default ClientCheck;
