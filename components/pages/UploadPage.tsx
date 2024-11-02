import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Skeleton,
} from '@chakra-ui/react';
import { FileUploader } from 'react-drag-drop-files';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/app/providers/GlobalContext';

const fileTypes = ['XLS', 'XLSX'];

interface ExcelRow {
  unidad: string | null;
  tel_uni: string | null;
  tel_clien: string | null;
  tipo_plan: string | null;
  plan_num: string | null;
  cod_mot_gen: string | null;
  criterios: string | null;
  contrato: string | null;
  entrega: string | null;
  situ_actual: string | null;
  situ_uni: string | null;
  cant_venci: string | null;
  cant_cuot: string | null;
  cliente_01: string | null;
  ejecutivoCta: string | null;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<ExcelRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFileUploaderLoading, setIsFileUploaderLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [cancelRef] = useState<React.RefObject<HTMLButtonElement>>(React.createRef());
  const toast = useToast();
  const router = useRouter();
  const { setExcelFileByUser } = useGlobalContext();

  useEffect(() => {
    const timer = setTimeout(() => setIsFileUploaderLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleFileChange = (file: File) => {
    setFile(file);
    setLoading(true);
    toast({
      title: 'Procesando archivo...',
      description: 'Esto puede tomar unos momentos.',
      status: 'info',
      duration: 3000,
    });
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: ExcelRow[] = (XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][])
      .map((row) => {
        return {
          unidad: row[0] as string || null,
          tel_uni: row[1] as string || null,
          tel_clien: row[2] as string || null,
          tipo_plan: row[3] as string || null,
          plan_num: row[4] as string || null,
          cod_mot_gen: row[5] as string || null,
          criterios: row[6] as string || null,
          contrato: row[7] as string || null,
          entrega: row[8] as string || null,
          situ_actual: row[9] as string || null,
          situ_uni: row[10] as string || null,
          cant_venci: row[11] as string || null,
          cant_cuot: row[12] as string || null,
          cliente_01: row[13] as string || null,
          ejecutivoCta: row[14] as string || null,
        };
      });
  
      // Validación de columnas
      const isValid = validateExcelData(json);
      if (!isValid) {
        toast({
          title: 'Error en el archivo.',
          description: 'El archivo Excel no cumple con el formato requerido.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setFile(null);
        setExcelData(null);
        setLoading(false);
        return;
      }
  
      setExcelData(json);
      toast({
        title: 'Archivo procesado con éxito.',
        description: 'Los datos han sido cargados.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };
  
  const validateExcelData = (data: ExcelRow[]) => {
    const expectedHeaders = [
      'unidad',
      'tel_uni',
      'tel_clien',
      'tipo_plan',
      'plan_num',
      'cod_mot_gen',
      'criterios',
      'contrato',
      'entrega',
      'situ_actual',
      'situ_uni',
      'cant_venci',
      'cant_cuot',
      'cliente_01',
      'ejecutivoCta'
    ].map(header => header.toLowerCase());
  
    if (data.length === 0) return false; // No hay datos
  
    const actualHeaders = Object.keys(data[0]).map(header => header.trim().toLowerCase());
    
    const headersMatch = expectedHeaders.every(header => actualHeaders.includes(header));
  
    return headersMatch && actualHeaders.length === expectedHeaders.length; // Verifica que todas las columnas necesarias estén presentes
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
      title: 'Carga cancelada.',
      description: 'El proceso de carga ha sido cancelado.',
      status: 'warning',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={4} h="screen" bg="gray.50">
      <Heading as="h1" size="xl" mb={4} color="gray.800">
        Subir datos de los clientes
      </Heading>
      <Box w={'40%'} mx={'auto'} mt={"4rem"}>
        <form onSubmit={handleSubmit}>
          <Flex height={"14rem"} p={6} border="1px" borderColor="gray.300" rounded="lg" shadow="md" flexDirection="column" alignItems={"center"} mb={6}>
            <Flex height={"20%"} width={"100%"} justifyContent={"center"} alignItems={"center"}>
              {file ? (
                <Text color={"green.400"} fontWeight={600} fontSize={22}>
                  {file.name}
                </Text>
              ) : (
                <Text color={"gray.500"} fontWeight={600} fontSize={22}>
                  Ingrese el archivo
                </Text>
              )}
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
      <Box mb={6}>
        {loading ? (
          <Skeleton height="400px" width="100%" />
        ) : excelData ? (
          <DataTable<ExcelRow>
            title="Datos del Archivo"
            columns={Object.keys(excelData[0]).map((key, index) => ({
              name: `Columna ${index + 1}`,
              selector: (row) => row[key as keyof ExcelRow] ?? "",
              sortable: true,
            }))}
            data={excelData}
            pagination
          />
        ) : (
          <Box height="400px" width="100%">
            <Text color="gray.500" textAlign="center">
              Cargue un archivo para ver los datos aquí.
            </Text>  
          </Box>
        )}
      </Box>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={() => setIsOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Confirmar Envío</AlertDialogHeader>
            <AlertDialogBody>¿Estás seguro de que deseas enviar estos datos?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="green" onClick={confirmSubmit} ml={3}>
                Enviar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
