import React, { useState } from 'react';
import { Box, Button, Flex, Heading, Text, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import BackendLogComponent from '../BackendLogComponent';
import Loader from '../extra/Loader';
import { sendAndscrape } from '@/services/apiService';

// Props para el componente
interface SendDebtsPageProps {
  textFile: string; // El texto del archivo que se usará en el proceso
}

const SendDebtsPage: React.FC<SendDebtsPageProps> = ({ textFile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast(); // Hook para los toasts

  // Función para iniciar el proceso
  const handleStartProcess = async () => {
    setIsLoading(true);

    try {
      const response = await sendAndscrape(textFile);

      if (response === 'Proceso completado con éxito, no se encontraron clientes sin deuda.' || response === 'Proceso completado con éxito.') {
        toast({
          title: 'Proceso completado',
          description: 'Las deudas han sido enviadas con éxito.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: 'Hubo un problema al iniciar el proceso.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error al iniciar el proceso:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al iniciar el proceso.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Box p={6} bg="gray.50" h="90vh">
      <Box p={6} bg="white" shadow="md" rounded="lg" h="70vh" maxW="container.xl" mx="auto" mt={4} overflow="hidden">
        <Heading as="h1" p={4} bg="blue.400" color="white" mb={4} borderRadius="md">
          Envío de Deudas a los Clientes
        </Heading>

        <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
          {/* Componente de Log del backend */}
          <Box flex="1" h="80%">
            <BackendLogComponent />
          </Box>

          {/* Información, proceso y botones */}
          <Flex direction="column" flex="1" align="center" justify="center" mt={8}>
            <Flex direction="column" align="center" mb={6}>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Información del Proceso
              </Text>
              <Text fontSize="md" fontWeight="normal" textAlign="center">
                Las deudas serán enviadas a los clientes a través de WhatsApp. Este proceso puede tardar unos minutos. Puedes seguir el progreso directamente desde la aplicación de WhatsApp en tu celular.
              </Text>
            </Flex>

            {isLoading ? (
              <>
                <Loader />
                <Text mt={4} fontWeight="semibold">Procesando... Esto puede tardar unos minutos</Text>
              </>
            ) : (
              <Text mb={4} fontWeight="semibold">
                Presiona "Iniciar proceso" para comenzar
              </Text>
            )}

            {/* Botones */}
            <Flex mt={8} gap={4}>
              <Button colorScheme="orange" onClick={handleGoBack} isDisabled={isLoading}>
                Volver a la Página Anterior
              </Button>
              <Button
                colorScheme="green"
                onClick={handleStartProcess}
                isLoading={isLoading}
                loadingText="Iniciando..."
                isDisabled={isLoading}
              >
                Iniciar Proceso
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default SendDebtsPage;
