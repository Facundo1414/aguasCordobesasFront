import React, { useEffect } from 'react';
import { Box, Button, Flex, Text, useToast } from '@chakra-ui/react';
import * as XLSX from 'xlsx';
import { getFileByName } from '@/app/services/apiService';
import { ExcelRow } from '../extra/typesSendFilterProcessPage';
import { useGlobalContext } from '@/app/providers/GlobalContext';

interface ProcessComponentProps {
  onProcess: () => void;
  fileWithoutWhatsApp: string | null;
  fileWithWhatsApp: string | null;
  onExcelDataUpdate: (data: ExcelRow[]) => void;
  handleFileChange: (file: File | Blob) => void;
}

const ProcessComponent: React.FC<ProcessComponentProps> = ({
  onProcess,
  fileWithoutWhatsApp,
  fileWithWhatsApp,
  onExcelDataUpdate,
  handleFileChange
}) => {
  const toast = useToast();

  const { accessToken, excelFileByUser } = useGlobalContext();
  const getToken = () => accessToken || localStorage.getItem('accessToken') || '';



  useEffect(() => {
    const fetchFilteredData = async () => {
      if (fileWithWhatsApp) {
        try {
          const fileBlob = await getFileByName(fileWithWhatsApp || "", getToken());
          
          // Call handleFileChange with the blob to update the table data
          handleFileChange(fileBlob);
  
          toast({
            title: 'Datos actualizados',
            description: 'Los datos filtrados han sido cargados en la tabla.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
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
  }, [fileWithWhatsApp]);
  

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" shadow="md" textAlign="center">
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Procesar archivo filtrado
      </Text>
      <Text mb={4}>Este archivo contiene los clientes filtrados y está listo para ser procesado.</Text>
      <Flex justifyContent="center" gap={4}>
        <Button colorScheme="blue" onClick={onProcess}>
          Iniciar Proceso
        </Button>
      </Flex>
    </Box>
  );
};

export default ProcessComponent;
