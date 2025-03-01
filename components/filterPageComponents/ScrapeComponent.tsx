import React, { useState } from 'react';
import { Box, Button, Flex, Heading, Text, useToast, Spinner, ScaleFade, Image } from '@chakra-ui/react';
import BackendLogComponent from '../filterPageComponents/BackendLogComponent';
import Loader from '../extra/Loader';
import { sendAndScrape } from '@/app/services/apiService';
import { useGlobalContext } from '@/app/providers/GlobalContext';

interface ScrapeComponentProps {
  filePath: string;
  onFileProcessed: (file: File | null) => void;
  onProcess: () => void;
  handleBack: () => void;
}

const ScrapeComponent: React.FC<ScrapeComponentProps> = ({ filePath, onFileProcessed,onProcess,handleBack  }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [processComplete, setProcessComplete] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const toast = useToast();
  const { accessToken } = useGlobalContext();
  const getToken = () => accessToken || localStorage.getItem('accessToken') || '';


  const onClickHandle = ()=>{
    onFileProcessed(file);
  }

  const handleScrapeProcess = async () => {
    if (!filePath) {
      toast({
        title: 'Archivo no encontrado',
        description: 'Por favor, selecciona un archivo válido para procesar.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await sendAndScrape(filePath, getToken());
      setProcessComplete(true);

      if (response?.file) {
        const fileBlob = new Blob([response.file], { type: 'application/xlsx' });
        const file = new File([fileBlob], 'Deudas-No-Enviadas.xlsx');
        setFile(file)
      }


      toast({
        title: 'Proceso Completo',
        description: 'La extracción se ha realizado con éxito.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error en el proceso',
        description: 'Hubo un problema durante la extracción de datos.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      direction="row"
      align="flex-start"
      p={6}
      border="1px"
      borderColor="gray.300"
      rounded="lg"
      shadow="md"
      borderRadius="md"
      boxShadow="md"
      width="90%"
      mx="auto"
      gap={6}
    >
      {/* Columna izquierda: Componente de log */}
      <Box flex="1" borderRadius="md" overflowY="hidden" maxHeight="400px" py={2}>
        {/* <BackendLogComponent /> */}
      </Box>

      {/* Columna derecha: Contenido principal */}
      <Flex
        direction="column"
        align="center"
        justifyContent={"center"}
        alignItems={"center"}
        flex="2"
        p={4}
        bg="white"
        borderRadius="md"
        boxShadow="md"
        position="relative"
        height={"100%"}
      >
        <Heading as="h2" size="md" color="gray.700" mb={4}>
          Proceso de Envio de archivos PDFs
        </Heading>

        {isLoading ? (
          <Flex 
          direction="column" 
          align="center" 
          justify="center" 
          gap={6} 
          p={6} 
          maxWidth="400px"
          mx="auto"
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <Loader />
          </Box>
          <Text fontSize="lg" color="gray.700" textAlign="center">
            Enviando archivos PDF a los clientes por WhatsApp. Puedes seguir el envío de las deudas desde la aplicación WhatsApp Web en tu celular.
          </Text>
          <Text fontSize="lg" color="gray.600" textAlign="center" mt={2}>
            Por favor, espera...
          </Text>
        </Flex>
        ) : (
          <ScaleFade in={!processComplete} initialScale={0.4}>
            {!processComplete && (
              <Flex width="100%" direction="column" align="center"  justifyContent="center">
                <Text fontSize="lg" color="gray.600" textAlign="center" mb={4} width={"80%"}>
                  {processComplete
                    ? 'El archivo se ha procesado con éxito. Puedes ver los registros en la consola.'
                    : 'Las deudas serán enviadas a los clientes a través de WhatsApp. Este proceso puede tardar unos minutos. Puedes seguir el progreso directamente desde la aplicación de WhatsApp en tu celular.'}
                </Text>
                  <Flex  width="60%"  justifyContent="space-between" alignItems="center">        
                    <Button 
                      bg="gray.600" 
                      color="white" 
                      rounded="lg" 
                      _hover={{ bg: "red.400" }} 
                      minWidth="120px"            
                      onClick={handleBack} 
                      >
                      Volver
                    </Button>
                    <Button
                      bg="blue.500" color="white" rounded="lg" _hover={{ bg: "blue.300" }} minWidth="120px"
                      onClick={handleScrapeProcess}
                      width="40%"
                    >
                      Iniciar Envio
                    </Button>
                  </Flex>
              </Flex>
            )}
          </ScaleFade>
        )}

        <ScaleFade in={processComplete} initialScale={0.9}>
          {processComplete && (
            <Flex width="100%" justifyContent="center" direction={"column"}>
              <Text color="gray.700" fontWeight="bold" align={"center"}>
                Se han enviado los PDF a los clientes satisfacoriamente.
              </Text>
              <Image src="/logoWater.png" alt="Logo" boxSize="50%" mx="auto" />
              <Button
                      bg="blue.500" color="white" rounded="lg" _hover={{ bg: "blue.300" }} minWidth="120px"
                      width="40%"
                      alignSelf={"center"}
                      onClick={onClickHandle}
                  >
                    Continuar
              </Button>
            </Flex>
          )}
        </ScaleFade>
      </Flex>
    </Flex>
  );
};

export default ScrapeComponent;
