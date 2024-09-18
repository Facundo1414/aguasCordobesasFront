'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { FaHome as HomeIcon, FaCloudUploadAlt as UploadIcon } from 'react-icons/fa';
import { Box, Flex, Button, Avatar, Image, Drawer, DrawerBody, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, Text, Stack } from '@chakra-ui/react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, error, isLoading } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  // Redirigir al login si no hay usuario autenticado y no hay error
  useEffect(() => {
    if (!isLoading && !user && !error) {
      router.push('/api/auth/login');
    }
  }, [user, isLoading, error, router]);

  // Mostrar un loader si aún está cargando la autenticación
  if (isLoading) return null;

  return (
    <Box bg="blue.600" color="white" p={4}>
      <Flex align="center" maxW="container.xl" mx="auto">
        <Link href="/" passHref>
          <Box flexShrink={0} pl={4} cursor="pointer">
            <Image src="/logoWater.png" alt="Logo" h={16}/>
          </Box>
        </Link>

        <Stack direction='row' spacing={4} flex={1} ml={8}>
          <Link href="/" passHref>
            <Button
              variant="ghost"
              leftIcon={<HomeIcon />}
              _hover={{ bg: 'green.300' }}
              color="whiteAlpha.900"
              fontSize="lg"
            >
              Inicio
            </Button>
          </Link>
          <Link href="/upload-page" passHref>
            <Button
              variant="ghost"
              leftIcon={<UploadIcon />}
              _hover={{ bg: 'green.300' }}
              color="whiteAlpha.900"
              fontSize="lg"
            >
              Subir archivos
            </Button>
          </Link>
        </Stack>
        <Box flexShrink={0}>
          <Avatar 
            src={user?.picture || '/default-avatar.png'} 
            bg="blue.300" 
            color="blue.600" 
            cursor="pointer" 
            onClick={onOpen} 
          />
        </Box>
      </Flex>

      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
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
