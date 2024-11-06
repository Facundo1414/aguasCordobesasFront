import React from 'react';
import { Box, Button, Flex, Text, useToast } from '@chakra-ui/react';
import { getFileByName } from '@/app/services/apiService';

interface ProcessComponentProps {
  onProcess: () => void;
  fileWithoutWhatsApp: string | null; // Ruta del archivo sin WhatsApp
  fileWithWhatsApp: string | null; 
}

const ProcessComponent: React.FC<ProcessComponentProps> = ({ onProcess, fileWithoutWhatsApp, fileWithWhatsApp  }) => {
  const toast = useToast();

  // Función para manejar la descarga del archivo sin WhatsApp
  const handleDownload = async () => {
    try {
      await getFileByName(fileWithoutWhatsApp || "");
      toast({
        title: 'Descarga exitosa',
        description: 'El archivo sin contactos de WhatsApp ha sido descargado.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      toast({
        title: 'Error de descarga',
        description: 'No se pudo descargar el archivo. Inténtalo de nuevo más tarde.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" shadow="md" textAlign="center">
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Procesar archivo filtrado
      </Text>
      <Text mb={4}>
        Este archivo contiene los clientes filtrados y está listo para ser procesado.
      </Text>
      <Flex justifyContent="center" gap={4}>
        <Button colorScheme="blue" onClick={onProcess}>
          Iniciar Proceso
        </Button>
        <Button colorScheme="green" onClick={handleDownload}>
          Descargar Archivo sin WhatsApp
        </Button>
      </Flex>
    </Box>
  );
};

export default ProcessComponent;
