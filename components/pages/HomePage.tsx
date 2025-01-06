import React, { useEffect, useState } from 'react';
import { Box, Grid, GridItem, Heading, Text, Image, Flex, IconButton, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, Spinner, ModalFooter, Button } from '@chakra-ui/react';
import { ChevronRightIcon, EmailIcon, PhoneIcon, PlusSquareIcon, QuestionIcon } from '@chakra-ui/icons';
import ModalEnDesarrollo from '../homeComponents/ModalEnDesarrollo';
import { useRouter } from 'next/navigation';
import { checkInitializationStatus, getIsLoggedIn } from '@/app/services/apiService';
import { useGlobalContext } from '@/app/providers/GlobalContext';
import WhatsappSesionIntialize from '../homeComponents/WhatsappSesionIntializeModal';
import { motion } from 'framer-motion';  // Importar motion

interface LoginResponse {
  isLoggedIn: boolean;
}
interface isInitializingResponse {
  isInitializing: boolean;
}


export default function HomePage() {
  const router = useRouter();
  const [isServicio2ModalOpen, setIsServicio2ModalOpen] = useState(false);
  const [isEnDesarrolloModalOpen, setIsEnDesarrolloModalOpen] = useState(false);
  const [isInitializationModalOpen, setIsInitializationModalOpen] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const toast = useToast()

  const handleOpenInitializationModal = () => setIsInitializationModalOpen(true);
  const handleCloseInitializationModal = () => setIsInitializationModalOpen(false);
  
  const handleOpenServicio2Modal = () => setIsServicio2ModalOpen(true);
  const handleCloseServicio2Modal = () => setIsServicio2ModalOpen(false);

  const handleOpenEnDesarrolloModal = () => setIsEnDesarrolloModalOpen(true);
  const handleCloseEnDesarrolloModal = () => setIsEnDesarrolloModalOpen(false);

  const { accessToken } = useGlobalContext();
  const getToken = () => accessToken || localStorage.getItem('accessToken') || '';


  const checkInitialization = async () => {
    if (!isSessionReady) {
      setIsInitializationModalOpen(true); // Abre el modal mientras verifica
      const token = getToken();
      try {
        const response: isInitializingResponse = await checkInitializationStatus(token);
        if (response.isInitializing) {
          setIsSessionReady(true);
        }
      } catch (error) {
        console.error("Error al verificar el estado de inicio de sesión:", error);
      } finally {
        // Agregar un ligero retraso para garantizar visibilidad
        setTimeout(() => setIsInitializationModalOpen(false), 500); 
      }
    }
  };
  

  useEffect(()=>{
    checkInitialization()
  },[])
  

  const handleClick = async () => {
  
    const token = getToken();
  
    // Llamar a la API para verificar si el usuario está logueado
    if (!isSessionReady) {
      const promise = getIsLoggedIn(token);
      // Mostrar el toast con promesa
      toast.promise(promise, {
        loading: { title: 'Verificando sesión...', description: 'Por favor espere...' },
        success: { title: 'Sesión verificada', description: 'Redirigiendo...', duration: 1000 },
        error: { title: 'Error', description: 'No se pudo verificar el estado de la sesión', duration: 2000 },
      });
      // Esperar a que la promesa se resuelva y manejar la respuesta
      try {
        const response: LoginResponse = await promise;
        if (response.isLoggedIn) {
          router.push('/send-debts-page');
        } 
      } catch (error) {
        console.error("Error al verificar el estado de inicio de sesión:", error);
      }
    }
    else{
      router.push('/send-debts-page');
    }
  };
  

  return (
    <Box py={10} px={[4, 8, 20]}>
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        {/* Encabezado con logo y texto */}
        <GridItem colSpan={12}>
          <Flex borderRadius="lg" bg="white" shadow="lg">
            <Flex width={"30%"} justifyContent="center" alignItems="center" p={4} overflow={"hidden"}>
              <Flex width={"40%"} flexDirection={"column"} justifyContent={"center"}>
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
            {/* Primera tarjeta */}
            <GridItem colSpan={1}>
              <motion.div
                whileHover={{ scale: 1.05 }} // Efecto al pasar el ratón
                whileTap={{ scale: 0.95 }}   // Efecto de clic
                transition={{ type: "spring", stiffness: 300 }}
              >
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
              </motion.div>
            </GridItem>

            {/* Segunda tarjeta */}
            <GridItem colSpan={1}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Box
                  p={4}
                  bg="blue.400"
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
                <WhatsappSesionIntialize isOpen={isServicio2ModalOpen} onClose={handleCloseServicio2Modal} setIsSessionReady={setIsSessionReady} />
              </motion.div>
            </GridItem>

            {/* Tercera tarjeta */}
            <GridItem colSpan={1}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Box
                  p={4}
                  bg="teal.400"
                  borderRadius="md"
                  display="flex"
                  w="100%"
                  h="6rem"
                  alignItems="center"
                  onClick={handleOpenEnDesarrolloModal}
                  as="button"
                >
                  <PlusSquareIcon w={8} h={8} color="white" />
                  <Text ml={4} fontSize="lg" color="white">
                    Guardar Clientes
                  </Text>
                </Box>
              </motion.div>
            </GridItem>

            {/* Cuarta tarjeta */}
            <GridItem colSpan={1}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Box
                  p={4}
                  bg="blue.400"
                  borderRadius="md"
                  display="flex"
                  w="100%"
                  h="6rem"
                  alignItems="center"
                  onClick={handleOpenEnDesarrolloModal}
                  as="button"
                >
                  <QuestionIcon w={8} h={8} color="white" />
                  <Text ml={4} fontSize="lg" color="white">
                    Preguntas Frecuentes
                  </Text>
                </Box>
              </motion.div>
            </GridItem>

            {/* Quinta tarjeta */}
            <GridItem colSpan={1}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Box
                  p={4}
                  bg="teal.400"
                  borderRadius="md"
                  display="flex"
                  w="100%"
                  h="6rem"
                  alignItems="center"
                  onClick={handleOpenEnDesarrolloModal}
                  as="button"
                >
                  <PlusSquareIcon w={8} h={8} color="white" />
                  <Text ml={4} fontSize="lg" color="white">
                    Más Detalles
                  </Text>
                </Box>
              </motion.div>
            </GridItem>

            {/* Sexta tarjeta */}
            <GridItem colSpan={1}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Box
                  p={4}
                  bg="blue.400" 
                  borderRadius="md"
                  display="flex"
                  w="100%"
                  h="6rem"
                  alignItems="center"
                  onClick={handleOpenEnDesarrolloModal}
                  as="button"
                >
                  <PlusSquareIcon w={8} h={8} color="white" />
                  <Text ml={4} fontSize="lg" color="white">
                    Bot para respuestas automaticas en whatsapp
                  </Text>
                </Box>
              </motion.div>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>

      {/* Modal en Desarrollo */}
      <ModalEnDesarrollo isOpen={isEnDesarrolloModalOpen} onClose={handleCloseEnDesarrolloModal} />

            {/* Modal de inicialización */}
      <Modal isOpen={isInitializationModalOpen} onClose={handleCloseInitializationModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Verificando sesión de Whatsapp</ModalHeader>
          <ModalBody display="flex" justifyContent="center" alignItems="center">
            <Spinner size="lg" />
            <Text ml={4}>Por favor espere mientras verificamos la sesión...</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseInitializationModal} variant="ghost">
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
