// components/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import { FaHome as HomeIcon, FaCloudUploadAlt as UploadIcon, FaUser as UserIcon } from 'react-icons/fa';
import { Box, Flex, Button, Avatar, Image } from '@chakra-ui/react';

export default function Navbar() {
  return (
    <Box bg="blue.600" color="white" p={4}>
      <Flex align="center" maxW="container.xl" mx="auto">
        <Box flexShrink={0} pl={4}>
          <Image src="/logoWater.ico" alt="Logo" h={16} /> {/* Ajusta el tamaño según sea necesario */}
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
          <Link href="/test-page" passHref>
            <Button variant="link" leftIcon={<UploadIcon />} color="white" fontSize="lg">
              Test
            </Button>
          </Link>
        </Flex>
        <Box flexShrink={0}>
          <Avatar bg="blue.300" color="blue.600" icon={<UserIcon />} />
        </Box>
      </Flex>
    </Box>
  );
}
