import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Heading, Text, useToast, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Skeleton } from '@chakra-ui/react';
import { FileUploader } from 'react-drag-drop-files';
import * as XLSX from 'xlsx';
import ExcelTable from '../ExcelTable';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/app/providers/GlobalContext';

const fileTypes = ["XLS", "XLSX"];

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<any[][] | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFileUploaderLoading, setIsFileUploaderLoading] = useState(true); // Para el skeleton del FileUploader
  const [isOpen, setIsOpen] = useState(false);
  const [cancelRef] = useState<React.RefObject<HTMLButtonElement>>(React.createRef());
  const toast = useToast();
  const router = useRouter();

  const { setExcelFileByUser } = useGlobalContext();

  useEffect(() => {
    // Mostrar el skeleton durante 1 segundo antes de cargar el FileUploader
    const timer = setTimeout(() => setIsFileUploaderLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleFileChange = (file: File) => {
    setFile(file);
    setLoading(true);
    toast({
      title: "Procesando archivo...",
      description: "Esto puede tomar unos momentos.",
      status: "info",
      duration: 3000,
    });

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
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const confirmSubmit = () => {
    setIsOpen(false);
    if (file && excelData) {
      setExcelFileByUser({
        data: excelData,
        fileName: file.name,
        isSentOrUsed: false,
      });
      router.push('/filter-page');
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
    <Box p={4} h="screen" bg="gray.50">
      <Heading as="h1" size="xl" mb={4} color="gray.800">
        Subir datos de los clientes
      </Heading>
      <Box w={'40%'} mx={'auto'}>
        <form onSubmit={handleSubmit}>
          <Flex height={"12rem"} p={2} border="1px" borderColor="gray.300" rounded="lg" shadow="md" flexDirection="column" alignItems={"center"} mb={6}>
            <Flex height={"20%"} width={"100%"} justifyContent={"center"} alignItems={"center"}>
              {file ? (
                <Text  color={"green.400"} fontWeight={600} fontSize={22}>
                  {file.name}
                </Text>
                ) : (
                <Text color={"gray.500"} fontWeight={600} fontSize={22}>
                  Ingrese el archivo
                </Text>)
              }
            </Flex>

            <Flex height={"60%"} width={"100%"} justifyContent={"center"} alignItems={"center"}>
              {isFileUploaderLoading ? (
                <Skeleton height="60px" width="100%" />
              ) : (
                <FileUploader handleChange={handleFileChange} name="file" types={fileTypes} alignSelf={"center"} />
              )}
            </Flex>

            <Flex height={"20%"} width={"100%"} padding={6} justifyContent={"space-between"} alignItems={"center"}>
              <Button onClick={handleCancel} bg="red.500" color="white" rounded="lg" _hover={{ bg: "red.600" }} minWidth="120px">
                Cancelar
              </Button>
              <Button type="submit" bg="green.300" color="white" rounded="lg" _hover={{ bg: "green.600" }} minWidth="120px">
                Filtrar Archivo
              </Button>
            </Flex>
          </Flex>
        </form>
      </Box>

      <ExcelTable excelData={excelData} />

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={() => setIsOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Ir a Filtrar Archivo
            </AlertDialogHeader>

            <AlertDialogBody>
              Se redireccionará a la página para filtrar el archivo.
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
