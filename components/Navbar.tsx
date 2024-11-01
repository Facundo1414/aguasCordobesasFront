'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { FaHome as HomeIcon, FaCloudUploadAlt as UploadIcon } from 'react-icons/fa';
import { Box, Flex, Button, Avatar, Image, Drawer, DrawerBody, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, Text, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();


  return (
    <Box bg="blue.600" color="white" p={2} h={16} >
      <Flex align="center" w={"100%"}>
        <Flex w={"10%"} justifyContent={"center"} alignItems={"center"}>
          <Link href="/" passHref>
            <Box cursor="pointer">
              <Image src="/logoWater.png" alt="Logo" h={12}/>
            </Box>
          </Link>
        </Flex>

        <Stack direction='row' spacing={4} flex={1} w={"80%"} justifyContent={"flex-start"}>
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

        <Flex w={"10%"} justifyContent={"center"} alignItems={"center"}>
          <Avatar 
            src={'/default-avatar.png'} 
            bg="blue.300" 
            color="blue.600" 
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
            <Text>Bienvenido, </Text>
            <Button mt={4} colorScheme="teal" onClick={() => window.location.href = '/login-page'}>
              Cerrar sesión
            </Button>        
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
