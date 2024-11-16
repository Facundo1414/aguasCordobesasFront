import React, { useState } from 'react';
import { Box, Grid, GridItem, Heading, Text, Image, Flex } from '@chakra-ui/react';
import {  ChevronRightIcon, EmailIcon,  PlusSquareIcon, QuestionIcon } from '@chakra-ui/icons';
import Servicio2Modal from '../homeComponents/Servicio2Modal';
import ModalEnDesarrollo from '../homeComponents/ModalEnDesarrollo';
import { useRouter } from 'next/navigation';
import { getIsLoggedIn } from '@/app/services/apiService';
import { useGlobalContext } from '@/app/providers/GlobalContext';

export default function HomePage() {
  const router = useRouter();
  const [isServicio2ModalOpen, setIsServicio2ModalOpen] = useState(false);
  const [isEnDesarrolloModalOpen, setIsEnDesarrolloModalOpen] = useState(false);

  const handleOpenServicio2Modal = () => setIsServicio2ModalOpen(true);
  const handleCloseServicio2Modal = () => setIsServicio2ModalOpen(false);

  const handleOpenEnDesarrolloModal = () => setIsEnDesarrolloModalOpen(true);
  const handleCloseEnDesarrolloModal = () => setIsEnDesarrolloModalOpen(false);

  const {accessToken} = useGlobalContext()
  const getToken = () => accessToken || localStorage.getItem('accessToken') || '';

  const handleClick = async () => {
    try {
      const response = await getIsLoggedIn(getToken());
      if (response.isLoggedIn) {
        router.push('/upload-page');
      } else {
        //handleOpenServicio2Modal();
      }
    } catch (error) {
      console.error("Error al verificar el estado de inicio de sesión:", error);
    }
  };


  return (
    <Box py={8} px={[4, 8, 20]}>
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        {/* Encabezado con logo y texto */}
        <GridItem colSpan={12}>
          <Flex borderRadius="lg" bg="white" shadow="lg">
            <Flex width={"30%"} justifyContent="center" alignItems="center" p={4} overflow={"hidden"}>
              <Flex width={"40%"} flexDirection={"column"} justifyContent="center" >
                <Heading as="h2">AQUA</Heading>
                <Text fontWeight="normal" fontSize={"1.2rem"} color="gray.600">
                  Al servicio de Cclip.
                </Text>
              </Flex>
              <Image width={"60%"} src="/logoWater.png" alt="Logo" boxSize={"12rem"} maxBlockSize={"15rem"} />
            </Flex>
            <Flex
              width={"70%"}
              justifyContent="center"
              alignItems="center"
              bgImage="url('/bg_topEspacioClientes.jpg')"
              bgSize="cover"
              borderRadius="lg"
              p={6}
            >
              <Text fontSize={["lg", "xx-large"]} maxW="60%" textAlign="right" color="white">
                Bienvenido a nuestra página. Aquí podrás encontrar servicios personalizados para la gestión de clientes.
              </Text>
            </Flex>
          </Flex>
        </GridItem>

        {/* Grid de servicios */}
        <GridItem colSpan={12}>
          <Flex mt={8} justifyContent="center" alignItems="center" textAlign="center" direction="column">
            <Text fontSize="3xl" fontWeight="bold" color="gray.800" mb={2}>
              Nuestros Servicios
            </Text>
            <Text fontSize="md" color="gray.500" maxW="70%">
              Descubre los servicios que ofrecemos para ayudarte en la gestión y optimización de tus clientes.
            </Text>
            <Box mt={4} w="60px" h="4px" bg="blue.300" borderRadius="full" />
          </Flex>
          <Grid templateColumns="repeat(3, 1fr)" gap={4} mt={8}>
            {/* Primera fila: 3 Cards */}
            <GridItem colSpan={1}>
              <Box
                p={4}
                bg="teal.400"
                borderRadius="md"
                display="flex"
                w="100%"
                h="6rem"
                alignItems="center"
                as="button"
                onClick={handleClick}
              >
                <EmailIcon w={8} h={8} color="white" />
                <Text ml={4} fontSize="lg" color="white">
                  Enviar Deudas a Clientes
                </Text>
              </Box>
            </GridItem>
            <GridItem colSpan={1}>
              <Box
                p={4}
                bg="orange.400"
                borderRadius="md"
                display="flex"
                w="100%"
                h="6rem"
                alignItems="center"
                onClick={handleOpenServicio2Modal}
                as="button"
              >
                <ChevronRightIcon w={8} h={8} color="white" />
                <Text ml={4} fontSize="lg" color="white">
                  Iniciar Sesion en Whatsapp
                </Text>
              </Box>
              <Servicio2Modal isOpen={isServicio2ModalOpen} onClose={handleCloseServicio2Modal} />
            </GridItem>
            <GridItem colSpan={1}>
              <Box
                p={4}
                bg="orange.400"
                borderRadius="md"
                display="flex"
                w={"100%"}
                h={"6rem"}
                alignItems="center"
                onClick={handleOpenEnDesarrolloModal}
                as="button"
              >
                <PlusSquareIcon w={8} h={8} color="white" />
                <Text ml={4} fontSize="lg" color="white">
                  Guardar Clientes
                </Text>
              </Box>
            </GridItem>

            {/* Segunda fila: 2 Cards */}
            <GridItem colSpan={1}>
              <Box
                p={4}
                bg="green.400"
                borderRadius="md"
                display="flex"
                w={"100%"}
                h={"6rem"}
                alignItems="center"
                onClick={handleOpenEnDesarrolloModal}
                as="button"
              >
                <QuestionIcon w={8} h={8} color="white" />
                <Text ml={4} fontSize="lg" color="white">
                  Informacion
                </Text>
              </Box>
            </GridItem>
            <GridItem colSpan={2}>
              <Box
                p={4}
                bg="blue.400"
                borderRadius="md"
                display="flex"
                w={"100%"}
                h={"6rem"}
                alignItems="center"
                onClick={handleOpenEnDesarrolloModal}
                as="button"
              >
                <ChevronRightIcon w={8} h={8} color="white" />
                <Text ml={4} fontSize="lg" color="white">
                  Archivos Guardados
                </Text>
              </Box>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>

      {/* Modal en Desarrollo */}
      <ModalEnDesarrollo isOpen={isEnDesarrolloModalOpen} onClose={handleCloseEnDesarrolloModal} />
    </Box>
  );
}
