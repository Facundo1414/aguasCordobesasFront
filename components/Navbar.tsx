'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaHome as HomeIcon } from 'react-icons/fa';
import { Box, Flex, Button, Avatar, Image, Drawer, DrawerBody, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, Text, Stack, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/app/providers/GlobalContext';
import Cookies from 'js-cookie';
import { userLogout } from '@/app/services/apiService';

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { setAccessToken, setRefreshToken, usernameGlobal, setUsernameGlobal } = useGlobalContext();
  
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Nuevo estado para manejar la carga

  const handleLogout = async () => {
    setIsLoggingOut(true); // Activar el estado de carga

    const token = localStorage.getItem("accessToken");
    if (token) {
      await userLogout(token); // Llamada API para cerrar sesión
    }

    // Eliminar tokens del localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');

    // Limpiar el contexto
    setAccessToken("");
    setRefreshToken("");
    setUsernameGlobal("");

    // Eliminar cookies
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');

    // Redirigir al usuario a la página de inicio de sesión
    router.push('/login-page');
  };

  return (
    <Box bg="blue.900" color="white" p={2} h={16}>
      <Flex align="center" w={"100%"}>
        <Flex w={"10%"} justifyContent={"center"} alignItems={"center"}>
          <Link href="/" passHref>
            <Box cursor="pointer">
              <Image src="/logoWater.png" alt="Logo" h={12} />
            </Box>
          </Link>
        </Flex>

        <Stack direction='row' spacing={4} flex={1} w={"80%"} justifyContent={"flex-start"}>
          <Link href="/" passHref>
            <Button
              variant="ghost"
              leftIcon={<HomeIcon />}
              _hover={{ bg: 'teal.400' }}
              color="whiteAlpha.900"
              fontSize="lg"
            >
              Inicio
            </Button>
          </Link>
        </Stack>

        <Flex w={"10%"} justifyContent={"center"} alignItems={"center"}>
          <Avatar
            bg="teal.300"
            color="teal.600"
            cursor="pointer"
            onClick={onOpen}
          />
        </Flex>
      </Flex>

      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody padding={6} gap={6}>
            <Text>Bienvenido, {usernameGlobal}</Text>
            <Button
              mt={4}
              colorScheme="teal"
              onClick={handleLogout}
              isLoading={isLoggingOut} // Activar el estado de carga en el botón
              loadingText="Cerrando sesión..." // Texto mientras se espera
            >
              {isLoggingOut ? <Spinner size="sm" color="white" /> : 'Cerrar sesión'} {/* Mostrar spinner si está cargando */}
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
