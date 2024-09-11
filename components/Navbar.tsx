'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { FaHome as HomeIcon, FaCloudUploadAlt as UploadIcon } from 'react-icons/fa';
import { Box, Flex, Button, Avatar, Image, Drawer, DrawerBody, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, Text } from '@chakra-ui/react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, error, isLoading } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    // Solo redirecciona en el lado del cliente, cuando el componente esté montado
    if (!isLoading && !user && !error) {
      router.push('/api/auth/login');
    }
  }, [user, isLoading, error, router]);

  // Muestra un loader mientras verifica la autenticación
  if (isLoading) return <p>Loading...</p>;

  // Si hay error de autenticación
  if (error) return <p>Error al autenticar</p>;

  return (
    <Box bg="blue.600" color="white" p={4}>
      <Flex align="center" maxW="container.xl" mx="auto">
        <Box flexShrink={0} pl={4}>
          <Image src="/logoWater.png" alt="Logo" h={16}/>
        </Box>
        <Flex flexGrow={1} justify="start" ml={8} gap={8}>
          <Link href="/" passHref>
            <Button variant="link" leftIcon={<HomeIcon />} color="white" fontSize="lg">
              Inicio
            </Button>
          </Link>
          <Link href="/upload-page" passHref>
            <Button variant="link" leftIcon={<UploadIcon />} color="white" fontSize="lg">
              Subir archivos
            </Button>
          </Link>
        </Flex>
        <Box flexShrink={0}>
          {user ? (
            <Avatar 
              src={user?.picture ?? '/default-avatar.png'} // Imagen por defecto
              bg="blue.300" 
              color="blue.600" 
              cursor="pointer" 
              onClick={onOpen} 
            />
          ) : (
            <Button onClick={() => window.location.href = '/api/auth/login'}>Iniciar sesión</Button>
          )}
        </Box>
      </Flex>

      <Drawer placement={'right'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody padding={6} gap={6}>  
            <Text>Bienvenido, {user?.name}</Text>
            <Button mt={4} colorScheme="teal" onClick={() => window.location.href = '/api/auth/logout'}>
              Cerrar sesión
            </Button>        
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
