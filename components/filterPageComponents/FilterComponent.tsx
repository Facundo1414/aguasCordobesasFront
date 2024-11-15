import React from 'react';
import { Box, Button, Text, useToast, Flex } from '@chakra-ui/react';
import { useGlobalContext } from '@/app/providers/GlobalContext';
import {  uploadExcelFile } from '@/app/services/apiService';
import * as XLSX from 'xlsx';

interface FilterComponentProps {
  onFilter: (fileWithWhatsApp: string, fileWithoutWhatsApp: string) => void; 
}

const FilterComponent: React.FC<FilterComponentProps> = ({ onFilter }) => {

  const toast = useToast();
  const { accessToken, excelFileByUser } = useGlobalContext();
  const getToken = () => accessToken || localStorage.getItem('accessToken') || '';


  const createFormData = () => {
    const formData = new FormData();
    if (excelFileByUser) {
      // Generar un archivo Excel a partir de los datos JSON
      const worksheet = XLSX.utils.json_to_sheet(excelFileByUser.data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
      // Convertir el workbook a un Blob en formato Excel
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
  
      // Agregar el Blob de Excel a FormData
      formData.append('file', excelBlob, excelFileByUser.fileName || 'filteredData.xlsx');
    }
    return formData;
  };
  
  

  const handleFileUpload = async () => {
    try {
      const formData = createFormData();
      const response = await uploadExcelFile(formData, getToken());

      if (response.savedFileNames) {
        toast({
          title: 'Archivo procesado con éxito',
          description: 'Los archivos resultantes están listos para descargar.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onFilter(response.savedFileNames[0], response.savedFileNames[1]);
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
      direction="column" 
      justify="center" 
      align="center"
      width={"40%"}
    >
      <Text 
        fontSize="lg" 
        fontWeight="bold" 
        textAlign="center" 
        mb={4}
      >
        Si los datos mostrados en la tabla coinciden con el archivo que subiste,
        haz clic en &quot;Filtrar Archivo&quot; para obtener aquellos clientes con WhatsApp.
      </Text>
      <Button 
        onClick={handleFileUpload} 
        colorScheme="green"
      >
        Filtrar Archivo
      </Button>
    </Flex>


  );
};

export default FilterComponent;
