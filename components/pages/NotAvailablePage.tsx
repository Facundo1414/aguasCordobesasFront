'use client';
import { Box, Text, Image, Center, Stack, Button } from '@chakra-ui/react';
import Link from 'next/link';

const NotAvailable = () => {
  return (
    <Center bg="gray.100" h="100vh">
      <Box
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="lg"
        textAlign="center"
        maxWidth="lg"
      >
        <Image src={'/logoWater.png'} alt="Logo" boxSize="150px" mx="auto" mb={6} />
        <Text fontSize="2xl" fontWeight="bold" color="red.600" mb={4}>
          Este sitio no está disponible en dispositivos móviles
        </Text>
        <Text color="gray.600" mb={6}>
          Por favor, acceda desde una pantalla más grande (escritorio).
        </Text>
      </Box>
    </Center>
  );
};

export default NotAvailable;
