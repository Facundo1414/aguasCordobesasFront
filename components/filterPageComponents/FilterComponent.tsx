import React from 'react';
import { Box, Button, Text, useToast, Flex } from '@chakra-ui/react';
import { useGlobalContext } from '@/app/providers/GlobalContext';
import {  uploadExcelFile } from '@/app/services/apiService';

interface FilterComponentProps {
  onFilter: (fileWithoutWhatsApp: string, fileWithWhatsApp: string) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ onFilter }) => {

  const toast = useToast();
  const { accessToken, excelFileByUser } = useGlobalContext();
  const getToken = () => accessToken || localStorage.getItem('accessToken') || '';


  const createFormData = () => {
    const formData = new FormData();
    if (excelFileByUser) {
      const blob = new Blob([JSON.stringify(excelFileByUser.data)], { type: 'application/json' });
      formData.append('file', blob, excelFileByUser.fileName);
    }
    return formData;
  };
  
  

  const handleFileUpload = async () => {
    try {
      const formData = createFormData();
      const response = await uploadExcelFile('/upload/excel', formData, getToken());

      if (response.fileWithWhatsApp && response.fileWithoutWhatsApp) {
        toast({
          title: 'Archivo procesado con éxito',
          description: 'Los archivos resultantes están listos para descargar.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onFilter(response.fileWithoutWhatsApp, response.fileWithWhatsApp);
      }
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al procesar el archivo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };




  return (
    <Flex 
      height="14rem" 
      p={6} 
      border="1px" 
      borderColor="gray.300" 
      borderRadius="md" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center"
    >
      <Button onClick={handleFileUpload} colorScheme="blue">
        Filtrar archivo
      </Button>
    </Flex>

  );
};

export default FilterComponent;
