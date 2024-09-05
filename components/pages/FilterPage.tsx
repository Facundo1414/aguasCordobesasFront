import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Heading, Text, Image, useToast, Tabs, TabList, Tab, TabPanels, TabPanel, Stepper, Step, StepStatus, StepIndicator, StepTitle, StepDescription, StepSeparator, List, ListItem } from '@chakra-ui/react';
import ExcelTable from '../ExcelTable';
import * as XLSX from 'xlsx';
import { uploadExcelFile, checkLoginWsp, getFetchQRCode, getFileByName  } from '@/services/apiService';
import { useRouter } from 'next/navigation';


const FilterPage = () => {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [excelFileName, setExcelFileName] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const toast = useToast();
  const router = useRouter();
  const steps = [
    { title: "Paso 1", description: "Logearse" },
    { title: "Paso 2", description: "Filtrar Clientes" },
    { title: "Paso 3", description: "Seleccionar Tabla" },
  ];
  const [filePath, setFilePath] = useState<string | null>(null);
  const [savedFileNames, setSavedFileNames] = useState<string[]>([]);

  const [tableData1, setTableData1] = useState<any[][]>([]);
  const [tableData2, setTableData2] = useState<any[][]>([]);
  const [tableData3, setTableData3] = useState<any[][]>([]);  
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const checkLoginStatus = async () => {
    try {
      const response = await checkLoginWsp();
      
      if (response.isLoggedIn) {
        setIsLoggedIn(true);
        setIsButtonDisabled(false);
      } else {
        setIsLoggedIn(false);
        setIsButtonDisabled(true);
      }
    } catch (error) {
      console.error('Error al verificar el estado de autenticación:', error);
      toast({
        title: 'Error de autenticación.',
        description: 'No se pudo verificar el estado de autenticación. Inténtalo de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const qrBlob = await getFetchQRCode();
        if (qrBlob) {
          setQrCode(URL.createObjectURL(qrBlob));
        } else {
          console.error('Failed to fetch QR code');
        }
      } catch (error) {
        console.error('Error fetching QR code:', error);
      }
    };

    fetchQRCode();
  }, []);

  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleUpload = async () => {
    try {
      setIsButtonDisabled(true); 

      const base64String = sessionStorage.getItem('ExcelFile');
      if (base64String) {
        const binaryString = atob(base64String);
        const binaryLen = binaryString.length;
        const bytes = new Uint8Array(binaryLen);
        for (let i = 0; i < binaryLen; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        // Crear un archivo .xlsx desde los bytes
        const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const formData = new FormData();
        formData.append('file', blob, 'data.xlsx');

        // Enviar el archivo al servidor
        const response = await uploadExcelFile('/upload/excel', formData);

        if (response && response.message === "Archivo subido y procesado exitosamente") {
          const { filePath, savedFileNames } = response;

          // Almacena esta información en el estado para su posterior uso
          setFilePath(filePath);
          setSavedFileNames(savedFileNames);
          fetchFilesData(savedFileNames)

          toast({
            title: 'Datos enviados.',
            description: 'Los datos se han filtrado y enviado con éxito.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        } else {
          throw new Error('La respuesta del servidor no es la esperada');
        }
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      setIsButtonDisabled(false); // Reactivar el botón si hay error
    
      toast({
        title: 'Error al enviar los datos.',
        description: 'Hubo un problema al enviar los datos. Inténtalo de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  

  useEffect(() => {
    const base64String = sessionStorage.getItem('ExcelFile');
    const fileName = sessionStorage.getItem('excelFileName');
    
    if (base64String) {
      const binaryString = atob(base64String);
      const binaryLen = binaryString.length;
      const bytes = new Uint8Array(binaryLen);
      for (let i = 0; i < binaryLen; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const workbook = XLSX.read(bytes, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
      setExcelData(data);
      setExcelFileName(fileName);
    }
  }, []);

  const handleLoginConfirmation = async () => {
    // Verifica si el usuario está autenticado antes de continuar
    await checkLoginStatus();
    if (!isLoggedIn) {
      toast({
        title: 'Usuario no autenticado.',
        description: 'Debes estar autenticado en WhatsApp para realizar esta acción.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return; // Salir de la función sin continuar con la carga
    }else{
      toast({
        title: 'Usuario autenticado con exito.',
        description: 'Ahora puedes filtrar los datos de los clientes.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
    setIsButtonDisabled(false);
    setActiveStep(1)
  };


  const fetchFilesData = async (fileNames: string[]) => {
    setIsLoading(true);
    try {
      const fetchedData = await Promise.all(
        fileNames.map(async (fileName) => {
          const fileBlob = await getFileByName(fileName); 
          return fileBlob; 
        })
      );
  
      const dataArrays = await Promise.all(
        fetchedData.map(async (blob) => {
          const arrayBuffer = await blob.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]; 
          
          // Insertar una columna vacía en la posición [3]
          data.forEach(row => row.splice(3, 0, '')); 
  
          return data;
        })
      );
  
      // Distribuir los datos en el estado según el número de archivos
      if (dataArrays.length > 0) setTableData1(dataArrays[0]);
      if (dataArrays.length > 1) setTableData2(dataArrays[1]);
      if (dataArrays.length > 2) setTableData3(dataArrays[2]);

      setActiveStep(2);
  
    } catch (error) {
      console.error('Error al obtener los archivos ya filtrados:', error);
      toast({
        title: 'Error al obtener los archivos ya filtrados.',
        description: 'Hubo un problema al obtener los archivos. Inténtalo de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendDebts = () => {
    if (tableData1.length > 0) {
      // Descargar el archivo de la tabla 1
      const ws = XLSX.utils.aoa_to_sheet(tableData1);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Clientes sin WhatsApp');
      XLSX.writeFile(wb, excelFileName || 'Clientes_sin_WhatsApp.xlsx');
    } else if (tableData2.length > 0) {
      // Redireccionar a la página de enviar deudas con el nombre del archivo de la tabla 2
      router.push(`/send-debts?fileName=${savedFileNames[1]}`);
    } else if (tableData3.length > 0) {
      // Redireccionar a la página de enviar deudas con el nombre del archivo de la tabla 3
      router.push(`/send-debts?fileName=${savedFileNames[2]}`);
    }
  };
  
  
  

  return (
    <Box p={6} h="full" w="full" bg="gray.50">
      {/* Stepper */}
      <Stepper size="md" index={activeStep} colorScheme="blue" mb={6}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<Text>✔</Text>}
                incomplete={<Text>{index + 1}</Text>}
                active={<Text>{index + 1}</Text>}
              />
            </StepIndicator>
            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
            <StepSeparator/>
          </Step>
        ))}
      </Stepper>

      {/* Primera Fila */}
      <Flex w="100%" mb={6} p={6} gap={12}>
        {/* Primera Columna */}
        <Box w="75%" p={6} bg="white" shadow="md" rounded="lg" ml={4} textAlign="center">
      <Text fontSize="lg" bg={"green.300"} shadow="md" rounded="lg" color="black.600" mb={4}>
        Para iniciar sesión y filtrar clientes, sigue estos pasos:
      </Text>

      <Flex justifyContent={"space-between"} px={20} py={6}>
        {/* Lista de pasos */}
        <Box w={"50%"}>
          <List spacing={3} textAlign="left">
            <ListItem>1. Abre WhatsApp en tu celular.</ListItem>
            <ListItem>2. Toca el ícono de menú (los tres puntos verticales) en la esquina superior derecha.</ListItem>
            <ListItem>3. Selecciona "Dispositivos vinculados".</ListItem>
            <ListItem>4. Toca en "Vincular un dispositivo" y escanea el código QR que aparece aquí.</ListItem>
          </List>
        </Box>

        {/* QR Code */}
        <Box border={"solid 3px green"} display="flex" justifyContent={"center"} alignItems={"center"}>
          {qrCode && (
            <Image 
              src={qrCode} 
              alt="Código QR para WhatsApp" 
              boxSize="200px" 
              mx="auto"
            />
          )}
        </Box>
      </Flex>

      {/* Botón de confirmación */}
      <Button 
        colorScheme="blue" 
        size="lg" 
        mt={6} 
        onClick={handleLoginConfirmation}
        bg={"green.300"}
        _hover={{ bg: "green.600" }}
      >
        He iniciado sesión correctamente
      </Button>
    </Box>

        {/* Segunda Columna */}
        <Flex w="25%" p={6} bg="white" shadow="md" rounded="lg" mr={4} flexDirection="column" justifyContent="space-between" alignItems={"center"}>
      <Heading as="h1" size="lg" mb={4} color="gray.800">
        Filtro de Clientes
      </Heading>

      {/* Visual icon for Excel file */}
      <Box textAlign="center" mb={4}>
        <Image 
          src="/excel-icon.png" 
          alt="Ícono de archivo Excel" 
          boxSize="150px" 
          mx="auto"
        />
              {/* File name */}
        <Text fontSize="md">
          {excelFileName || 'Ningún archivo cargado'}
        </Text>
      </Box>



      {/* Button */}
      <Button 
        colorScheme="blue" 
        size="lg" 
        onClick={handleUpload} 
        isDisabled={isButtonDisabled}
        bg={"green.300"}
        _hover={{ bg: "green.600" }}
      >
        Filtrar Clientes
      </Button>
    </Flex>
      </Flex>

      {/* Tabs y Tabla */}
      <Box mt={6} bg="white" p={6} shadow="md" rounded="lg">
        <Tabs isFitted variant='line' colorScheme='blue' align='center'>
          <TabList>
            <Tab>Clientes sin Whats App</Tab>
            <Tab>Clientes con Plan PA01</Tab>
            <Tab>Clientes otros Planes</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {isLoading ? (
                <Text>Cargando datos...</Text>
              ) : (
                <>
                <ExcelTable excelData={tableData1} />
                <Flex justifyContent={"flex-end"}>
                  <Button
                    colorScheme="blue" 
                    size="lg" 
                    onClick={handleSendDebts} 
                    bg={"green.300"}
                    _hover={{ bg: "green.600" }}
                    >
                    Descargar clientes sin Whatsapp
                  </Button>
                </Flex>
              </>
              )}
            </TabPanel>
            <TabPanel>
              {isLoading ? (
                <Text>Cargando datos...</Text>
              ) : (
                <>
                <ExcelTable excelData={tableData2} />
                <Flex justifyContent={"flex-end"}>
                  <Button
                    colorScheme="blue" 
                    size="lg" 
                    onClick={handleSendDebts} 
                    bg={"green.300"}
                    _hover={{ bg: "green.600" }}
                    >
                    Ir a Enviar Deudas 
                  </Button>
                </Flex>
              </>
              )}
            </TabPanel>
            <TabPanel>
              {isLoading ? (
                <Text>Cargando datos...</Text>
              ) : (
                <>
                  <ExcelTable excelData={tableData3} />
                  <Flex justifyContent={"flex-end"}>
                    <Button
                      colorScheme="blue" 
                      size="lg" 
                      onClick={handleSendDebts} 
                      bg={"green.300"}
                      _hover={{ bg: "green.600" }}
                      >
                      Ir a Enviar Deudas 
                    </Button>
                  </Flex>
                </>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default FilterPage;
