import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Heading, Text, useToast, Spinner, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { getFileByName } from '@/app/services/apiService';
import { ExcelRow } from '../extra/typesSendFilterProcessPage';
import { useGlobalContext } from '@/app/providers/GlobalContext';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';

interface FinalizeProcessComponentProps {
  fileWithWhatsApp: string | null;
  fileWithoutWhatsApp: string | null;
  fileProcessed: File | null;
  handleFileChange: (file: File | Blob) => void;
}

const FinalizeProcessComponent: React.FC<FinalizeProcessComponentProps> = ({ fileWithWhatsApp, fileWithoutWhatsApp, fileProcessed,  handleFileChange}) => {
    const router = useRouter();
    const toast = useToast();
    const { accessToken } = useGlobalContext();
    const getToken = () => accessToken || localStorage.getItem('accessToken') || '';


  // Handler to download the specified file (either with or without WhatsApp)
    const handleDownload = async (fileName: string | null) => {
        if (fileName) {
        try {
            const fileBlob = await getFileByName(fileName, getToken());
            const url = window.URL.createObjectURL(fileBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
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

    const handleDownloadBlob = () => {
        if (fileProcessed) {
          // Verifica si el archivo procesado es de tipo Excel
          if (fileProcessed.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || fileProcessed.name.endsWith('.xlsx')) {
            // Si es un archivo Excel, lo descarga directamente
            const url = URL.createObjectURL(fileProcessed);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileProcessed.name;
            a.click();
          } else {
            // Si no es un archivo Excel, puedes mostrar un error o mensaje de advertencia
            toast({
              title: 'Error',
              description: 'El archivo no es un archivo Excel válido.',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
          }
        }
      };
      

    const onGoBackHome = () => {
        router.push('/');
    }

  return (
    <Flex direction="column" alignItems="center" p={6} px={12} borderWidth="1px" borderRadius="lg" shadow="md">
      <Heading as="h3" size="lg" mb={4}>
        Proceso Completado
      </Heading>

      <Text mb={4}>
        El proceso ha finalizado satisfactoriamente. A continuación, puedes descargar los archivos generados.
      </Text>

      <Flex direction="column" mb={4} gap={4} justifyContent="space-between">
        {/* Descargar Excel de clientes que no se pudieron procesar */}
        <Flex direction="row" alignItems={"center"} justifyContent={"space-between"} gap={4} width="100%">
          <Text fontSize="lg" fontWeight="bold">
            Clientes a los que no se le envio el PDF
          </Text>
          <Button
            variant="outline"
            colorScheme="teal"
            onClick={() => handleDownloadBlob()}
            isDisabled={!fileProcessed}
          >
            <DownloadIcon />
          </Button>
        </Flex>

        {/* Descargar clientes con WhatsApp */}
        <Flex direction="row" alignItems={"center"} justifyContent={"space-between"} gap={4} width="100%">
          <Text fontSize="lg" fontWeight="bold" >
            Clientes con WhatsApp
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
          <Text fontSize="lg" fontWeight="bold">
            Clientes sin WhatsApp
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

        {/* Botón para regresar a la página principal */}
        <Button
          onClick={onGoBackHome}
          mt={4}
          bg="blue.500"
          color="white"
          rounded="lg"
          _hover={{ bg: "blue.300" }}
          minWidth="120px"
        >
          Volver a la página principal
        </Button>
      </Flex>
    </Flex>
  );
};

export default FinalizeProcessComponent;
