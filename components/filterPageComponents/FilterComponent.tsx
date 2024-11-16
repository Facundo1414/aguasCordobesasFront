"use client"

import React, { useState } from 'react';
import { Button, useToast, Flex, Text } from '@chakra-ui/react';
import { useGlobalContext } from '@/app/providers/GlobalContext';
import { uploadExcelFile } from '@/app/services/apiService';
import * as XLSX from 'xlsx';

interface FilterComponentProps {
  onFilter: (fileWithWhatsApp: string, fileWithoutWhatsApp: string) => void;
  handleBack: () => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ onFilter, handleBack }) => {
  const toast = useToast();
  const { accessToken, excelFileByUser } = useGlobalContext();
  const getToken = () => accessToken || localStorage.getItem('accessToken') || '';

  const [isProcessing, setIsProcessing] = useState(false);  // Para controlar el estado de procesamiento

  const createFormData = () => {
    const formData = new FormData();
    if (excelFileByUser) {
      const worksheet = XLSX.utils.json_to_sheet(excelFileByUser.data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
  
      formData.append('file', excelBlob, excelFileByUser.fileName || 'filteredData.xlsx');
    }
    return formData;
  };

  const handleFileUpload = async () => {
    const promise = new Promise<void>((resolve, reject) => {
      setIsProcessing(true);

      uploadExcelFile(createFormData(), getToken())
        .then(response => {
          if (response.savedFileNames) {
            resolve();
            onFilter(response.savedFileNames[0], response.savedFileNames[1]);
          } else {
            reject(new Error('Error en el proceso'));
          }
        })
        .catch(error => {
          console.error('Error al procesar el archivo:', error);
          reject(error);
        })
        .finally(() => {
          setIsProcessing(false);
        });
    });

    toast.promise(promise, {
      loading: { title: "Procesando archivo...", description: "Por favor, espera." },
      success: {
        title: "¡Archivo procesado con éxito!",
        description: "Los archivos resultantes están listos para descargar.",
      },
      error: {
        title: "Error",
        description: "Hubo un problema al procesar el archivo.",
      },
    });
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
      <Flex height="20%" width="100%" padding={6} justifyContent="space-between" alignItems="center">        
        <Button 
          onClick={handleBack} 
          bg="gray.600" 
          color="white" 
          rounded="lg" 
          _hover={{ bg: "red.400" }} 
          minWidth="120px"
          isDisabled={isProcessing}  // Deshabilitar cuando está procesando
        >
          Volver
        </Button>
        <Button 
          onClick={handleFileUpload} 
          bg="blue.500" 
          color="white" 
          rounded="lg" 
          _hover={{ bg: "blue.300" }} 
          minWidth="120px"
          isDisabled={isProcessing}  // Deshabilitar cuando está procesando
        >
          Filtrar Archivo
        </Button>
      </Flex>
    </Flex>
  );
};

export default FilterComponent;
