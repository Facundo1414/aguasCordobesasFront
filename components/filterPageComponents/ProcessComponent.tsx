import React, { useCallback, useEffect } from 'react';
import { Box, Button, Flex, Text, useToast } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { checkFileStatus, getFileByName } from '@/app/services/apiService';
import { ExcelRow } from '../extra/typesSendFilterProcessPage';
import { useGlobalContext } from '@/app/providers/GlobalContext';

interface ProcessComponentProps {
  onProcess: () => void;
  fileWithoutWhatsApp: string | null;
  fileWithWhatsApp: string | null;
  onExcelDataUpdate: (data: ExcelRow[]) => void;
  handleFileChange: (file: File | Blob) => void;
  handleBack: () => void;
}

const ProcessComponent: React.FC<ProcessComponentProps> = ({
  onProcess,
  fileWithoutWhatsApp,
  fileWithWhatsApp,
  onExcelDataUpdate,
  handleFileChange,
  handleBack
}) => {
  const toast = useToast();
  const { accessToken } = useGlobalContext();
  const getToken = useCallback(() => accessToken || localStorage.getItem('accessToken') || '', [accessToken]);

  useEffect(() => {
    const fetchFilteredData = async () => {
      if (fileWithWhatsApp) {
        try {
          await checkFileStatus(fileWithWhatsApp, getToken());

          const fileBlob = await getFileByName(fileWithWhatsApp || "", getToken());
          handleFileChange(fileBlob);
        } catch (error) {
          console.error('Error al descargar o procesar el archivo:', error);
          toast({
            title: 'Error',
            description: 'No se pudo cargar el archivo filtrado.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
    };

    fetchFilteredData();
  }, [fileWithWhatsApp, toast]);

  // Handler to download the specified file (either with or without WhatsApp)
  const handleDownload = async (fileName: string | null) => {
    if (fileName) {
      try {
        const fileBlob = await getFileByName(fileName, getToken());
        const url = window.URL.createObjectURL(fileBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName; // Nombre del archivo para la descarga
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error('Error al descargar el archivo:', error);
        toast({
          title: 'Error',
          description: 'Hubo un problema al intentar descargar el archivo.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Flex 
      p={6} 
      borderWidth="1px" 
      borderRadius="lg" 
      shadow="md"
      justifyContent={"center"}
      alignItems={"center"}
      width={"80%"}
    >
      <Flex direction="column" gap={4} width={"50%"}>
        {/* Descargar clientes con WhatsApp */}
        <Flex direction="row" alignItems={"center"} justifyContent={"space-between"} gap={4} width="100%">
          <Text fontSize="lg" fontWeight="bold" flex="1" textAlign="center">
            Descargar Excel de clientes con WhatsApp
          </Text>
          <Button 
            variant="outline"
            colorScheme="blue" 
            onClick={() => handleDownload(fileWithWhatsApp)} 
            isDisabled={!fileWithWhatsApp}
          >
            <DownloadIcon />
          </Button>
        </Flex>
        
        {/* Descargar clientes sin WhatsApp */}
        <Flex direction="row" alignItems={"center"} justifyContent={"space-between"} gap={4} width="100%">
          <Text fontSize="lg" fontWeight="bold" flex="1" textAlign="center">
            Descargar Excel de clientes sin WhatsApp
          </Text>
          <Button
            variant="outline" 
            colorScheme="orange" 
            onClick={() => handleDownload(fileWithoutWhatsApp)} 
            isDisabled={!fileWithoutWhatsApp}
          >
            <DownloadIcon />
          </Button>
        </Flex>
      </Flex>

      {/* Línea de separación */}
      <Box 
        height="100%" 
        width="1px" 
        bg="gray.300" 
        mx={4} 
      />

      {/* Procesar archivo filtrado */}
      <Flex textAlign="center" width={"50%"} direction={"column"} justifyContent={"center"} alignItems={"center"}>
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Procesar archivo filtrado
        </Text>
        <Text mb={4}>
          Este archivo contiene los clientes filtrados y está listo para ser procesado.
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
            onClick={onProcess} 
          >
            Iniciar Proceso
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProcessComponent;
