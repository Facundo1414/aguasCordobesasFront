import React, { useState } from 'react';
import { Box, Button, Flex, Heading, Text, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import BackendLogComponent from '../BackendLogComponent';
import Loader from '../extra/Loader';
import { sendAndscrape } from '@/services/apiService';
import { useGlobalContext } from '@/app/providers/GlobalContext';

// Props para el componente
interface SendDebtsPageProps {
  textFile: string; // El texto del archivo que se usará en el proceso
}

const SendDebtsPage: React.FC<SendDebtsPageProps> = ({ textFile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [processComplete, setProcessComplete] = useState(false);
  const [excelFile, setExcelFile] = useState<Blob | null>(null); // Archivo Excel
  const [message, setMessage] = useState<string | null>(null); // Mensaje del servidor
  const router = useRouter();
  const toast = useToast();
  const {
    pa01PlanClients,
    setPa01PlanClients,
    otherPlansClients,
    setOtherPlansClients,
  } = useGlobalContext(); 

  // Función para iniciar el proceso
  const handleStartProcess = async () => {
    setIsLoading(true);
    setProcessComplete(false); // Resetea el estado del proceso

    try {
      const response = await sendAndscrape(textFile);

      setProcessComplete(true);
      setMessage(response.message);

      if (response.file) {
        setExcelFile(response.file);
      }

      if (textFile === pa01PlanClients.fileName) {
        setPa01PlanClients({
          ...pa01PlanClients,
          isSentOrUsed: true
        })
      } else if (textFile === otherPlansClients.fileName) {
        setOtherPlansClients({
          ...otherPlansClients,
          isSentOrUsed: true
        })
      }

      toast({
        title: 'Proceso completado',
        description: response.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
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

  const handleDownloadExcel = () => {
    if (excelFile) {
      const url = window.URL.createObjectURL(excelFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Clientes sin deudas.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsDownloaded(true)
    }
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
            ) : processComplete ? (
              <Flex direction="column" align="center" mb={6}>
                <Text fontSize="xl" fontWeight="bold" mb={4}>
                  El proceso se completo con exito.
                </Text>
                <Flex gap={8}>
                  {excelFile && (
                    <Button colorScheme="blue" onClick={handleDownloadExcel} isDisabled={isDownloaded}>
                      Descargar Excel de clientes sin deudas
                    </Button>
                  )}
                  <Button colorScheme="orange" onClick={handleGoBack}>
                    Volver a la Página Anterior
                  </Button>
                </Flex>
              </Flex>
            ) : (
              <Text mb={4} fontWeight="semibold">
                Presiona "Iniciar proceso" para comenzar
              </Text>
            )}

            {/* Botón para iniciar el proceso */}
            {!isLoading && !processComplete && (
              <Flex justifyContent={"space-around"} w={"100%"}>
                <Button colorScheme="orange" onClick={handleGoBack}>
                  Volver a la Página Anterior
                </Button>
                <Button
                  colorScheme="green"
                  onClick={handleStartProcess}
                  isDisabled={isLoading}
                >
                  Iniciar Proceso
                </Button>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default SendDebtsPage;
