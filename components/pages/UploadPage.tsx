import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Heading, Text, useToast, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from '@chakra-ui/react';
import { FileUploader } from 'react-drag-drop-files';
import * as XLSX from 'xlsx';
import ExcelTable from '../ExcelTable';
import { useRouter } from 'next/navigation';


const fileTypes = ["XLS", "XLSX"];

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<any[][] | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // For AlertDialog
  const [cancelRef, setCancelRef] = useState<React.RefObject<HTMLButtonElement>>(React.createRef());
  const toast = useToast();
  const router = useRouter(); 



  const handleFileChange = (file: File) => {
    setFile(file);
    setLoading(true);
    toast({
      title: "Procesando archivo...",
      description: "Esto puede tomar unos momentos.",
      status: "info",
      duration: 3000,
    });

    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (json.length > 0) {
              const normalizedData = json.map(row => {
                  const newRow = [...row];
                  while (newRow.length < 8) {
                      newRow.push("");
                  }
                  newRow[2] = newRow[2] || "";
                  return newRow;
              });

              setExcelData(normalizedData);
              toast({
                  title: "Archivo procesado con éxito.",
                  description: "Los datos han sido cargados.",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
              });
          } else {
              toast({
                  title: "Error en el archivo.",
                  description: "El archivo Excel no contiene datos o tiene un formato incorrecto.",
                  status: "error",
                  duration: 5000,
                  isClosable: true,
              });
              setFile(null);
              setExcelData(null);
          }
          setLoading(false);
      };
      reader.readAsArrayBuffer(file);
  }, 1000); // Retraso de 1 segundo
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsOpen(true); // Open the AlertDialog
  };

  const confirmSubmit = async () => {
    setIsOpen(false);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1]; // Extract base64 part
        sessionStorage.setItem('excelFileName', file.name);
        sessionStorage.setItem('ExcelFile', base64String); // Guardar el archivo en sessionStorage
        router.push('/filter-page');
      };
      reader.readAsDataURL(file); // Leer el archivo como Data URL
    }
  };
  

  const handleCancel = () => {
    setFile(null);
    setExcelData(null);
    setLoading(false);
    toast({
      title: "Carga cancelada.",
      description: "El proceso de carga ha sido cancelado.",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
  };



  return (
    <Box p={4} h="100vh" bg="gray.50">
      <Heading as="h1" size="xl" mb={4} color="gray.800">
        Subir datos de los clientes
      </Heading>
      <form onSubmit={handleSubmit}>
        <Box height={"12rem"} p={2} border="1px" borderColor="gray.300" rounded="lg" shadow="md" display="flex" flexDirection="column" alignItems={"center"} mb={6}>
          {file? (
              <Text mt={6} color={"green.400"} fontWeight={600} fontSize={22}>
                {file.name}
              </Text>
            ): (
              <Text mt={6} color={"green.400"} fontWeight={600} fontSize={22}>
                Ingrese el archivo
              </Text>
          )}

          <Flex height={"60%"} width={"100%"} justifyContent={"center"} alignItems={"center"}>
            <FileUploader handleChange={handleFileChange} name="file" types={fileTypes} alignSelf={"center"}/>
          </Flex>
          
          <Flex height={"30%"} width={"100%"} padding={6} justifyContent={"space-between"} alignItems={"center"}>
            <Button onClick={handleCancel} bg="red.500" color="white" rounded="lg" _hover={{ bg: "red.600" }}>
              Cancelar
            </Button>
            <Button type="submit" bg="green.300" color="white" rounded="lg" _hover={{ bg: "green.600" }}>
              Filtrar Archivo
            </Button>
          </Flex>
        </Box>
      </form>

      <ExcelTable excelData={excelData}/>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Ir a Filtrar Archivo
            </AlertDialogHeader>

            <AlertDialogBody>
              Se reedireccionara a la pagina para filtrar el archivo.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme='blue' onClick={confirmSubmit} ml={3}>
                Continuar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
