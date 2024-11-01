import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Heading, Text, Image, useToast, Tabs, TabList, Tab, TabPanels, TabPanel, Stepper, Step, StepStatus, StepIndicator, StepTitle, StepDescription, StepSeparator, List, ListItem, Spinner } from '@chakra-ui/react';
import ExcelTable from '../ExcelTable';
import * as XLSX from 'xlsx';

import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/app/providers/GlobalContext';
import { uploadExcelFile, checkLoginWsp, getFetchQRCode, getFileByName } from '@/app/services/apiService';


const FilterPage = () => {
  //DATA
  const [excelData, setExcelData] = useState<any[]>([]);
  const [excelFileName, setExcelFileName] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [filePath, setFilePath] = useState<string | null>(null);
  //QR
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState<boolean>(true);
  //STEPS
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { title: "Paso 1", description: "Logearse" },
    { title: "Paso 2", description: "Filtrar Clientes" },
    { title: "Paso 3", description: "Seleccionar Tabla" },
  ];
  //
  const toast = useToast();
  const router = useRouter();

  // Table DATA
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tableSelect, setTableSelect] = useState<string>("");

  //Global context
  const {
    excelFileByUser,
    setExcelFileByUser, 
    noWhatsappClients,
    setNoWhatsappClients,
    pa01PlanClients,
    setPa01PlanClients,
    otherPlansClients,
    setOtherPlansClients,
  } = useGlobalContext(); // Utilizar el contexto global


  // Funtions
  useEffect(() => {
    setExcelData(excelFileByUser.data);
    setExcelFileName(excelFileByUser.fileName);
    if (noWhatsappClients.data.length || pa01PlanClients.data.length || otherPlansClients.data.length) {
      setActiveStep(2);
    }
  }, []);

  useEffect(() => {
    const checkLoginStatusAndFetchQRCode = async () => {
      try {
        const loginResponse = await checkLoginWsp();
        if (loginResponse.isLoggedIn) {
          setIsLoggedIn(true);
          setIsButtonDisabled(false);
          if (noWhatsappClients.data.length || pa01PlanClients.data.length || otherPlansClients.data.length) {
            setActiveStep(2);
          } else {
            setActiveStep(1);
          }
        } else {
          setIsLoggedIn(false);
          setIsButtonDisabled(true);
        }
  
        if (!loginResponse.isLoggedIn) {
          const qrBlob = await getFetchQRCode();
          if (qrBlob) {
            setQrCode(URL.createObjectURL(qrBlob));
          } else {
            console.error('Failed to fetch QR code');
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoadingQr(false);
      }
    };
  
    checkLoginStatusAndFetchQRCode();
  }, [excelData,isLoggedIn, qrCode ]);
  

  const handleLoginConfirmation = async () => {
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
  };

  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleUpload = async () => {
    if (excelFileByUser.isSentOrUsed) {
      setActiveStep(2);
      setIsLoading(false);
      toast({
        title: 'Ya se han filtrado los datos.',
        description: 'Los datos se han filtrado con éxito, ya no es necesario volverlos a filtrar.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsButtonDisabled(true); 
  
      // Verifica si hay datos en el estado excelData
      if (excelData && excelData.length > 0) {
        // Convierte los datos de Excel en un archivo Blob
        const worksheet = XLSX.utils.aoa_to_sheet(excelData); 
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
        // Crea un FormData y añade el archivo Blob
        const formData = new FormData();
        formData.append('file', blob, 'data.xlsx');
  
        // Envía el archivo al servidor
        const response = await uploadExcelFile('/upload/excel', formData);
  
        if (response && response.message === "Archivo subido y procesado exitosamente") {
          const { filePath, savedFileNames } = response;
  
          // Almacena esta información en el estado para su posterior uso
          setFilePath(filePath);
          fetchFilesData(savedFileNames);
  
          toast({
            title: 'Datos enviados.',
            description: 'Los datos se han filtrado y enviado con éxito.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          setExcelFileByUser({
            ...excelFileByUser,
            isSentOrUsed: true
          });
        } else {
          throw new Error('La respuesta del servidor no es la esperada');
        }
      } else {
        throw new Error('No hay datos en el estado de Excel');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      setIsButtonDisabled(false);
  
      toast({
        title: 'Error al enviar los datos.',
        description: 'Hubo un problema al enviar los datos. Inténtalo de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
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
        fetchedData.map(async (blob: any) => {
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
      if (dataArrays.length > 0) setNoWhatsappClients({ data: dataArrays[0], fileName: fileNames[0], isSentOrUsed: false });
      if (dataArrays.length > 1) setPa01PlanClients({ data: dataArrays[1], fileName: fileNames[1], isSentOrUsed: false });
      if (dataArrays.length > 2) setOtherPlansClients({ data: dataArrays[2], fileName: fileNames[2], isSentOrUsed: false });
      
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
    if (tableSelect === "") {
      return;
    }
    
    if (tableSelect === "0") {
      if (noWhatsappClients.data.length === 1 && noWhatsappClients.data[0].length > 0) {
        toast({
          title: 'No hay contenido para descargar.',
          description: 'La tabla que seleccionaste no contiene datos.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      const ws = XLSX.utils.aoa_to_sheet(noWhatsappClients.data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Clientes sin WhatsApp');
      XLSX.writeFile(wb, excelFileName || 'Clientes_sin_WhatsApp.xlsx');
    } else if (tableSelect === "1") {
      if (pa01PlanClients.isSentOrUsed) {
        toast({
          title: 'Ya se han enviado las deudas.',
          description: 'Las deudas ya se han enviado con éxito, ya no es necesario volverlas a enviar.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      if (pa01PlanClients.data.length < 1) {
        toast({
          title: 'No hay contenido para enviar.',
          description: 'La tabla que seleccionaste no contiene datos.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      sessionStorage.setItem('textFileNameForSend', pa01PlanClients.fileName);
      router.push('/sendDebts-page');
    } else if (tableSelect === "2") {
      if (otherPlansClients.isSentOrUsed) {
        toast({
          title: 'Ya se han enviado las deudas.',
          description: 'Las deudas ya se han enviado con éxito, ya no es necesario volverlas a enviar.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      if (otherPlansClients.data.length < 1) {
        toast({
          title: 'No hay contenido para enviar.',
          description: 'La tabla que seleccionaste no contiene datos.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      sessionStorage.setItem('textFileNameForSend', otherPlansClients.fileName);
      router.push('/sendDebts-page');
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
            <ListItem>3. Selecciona &quot;Dispositivos vinculados&quot;.</ListItem>
            <ListItem>4. Toca en &quot;Vincular un dispositivo&quot; y escanea el código QR que aparece aquí.</ListItem>
          </List>
        </Box>

        {/* QR Code */}
        <Box border="solid 3px green" display="flex" justifyContent="center" alignItems="center" boxSize="200px">
          {isLoggedIn ? (
            <Image 
              src="loggedQR.png"
              alt="Usuario autenticado"
              boxSize="100%"
              objectFit="cover"
            />
          ) : isLoadingQr ? (
            <Spinner 
              size="xl" 
              color="green.500" 
            />
          ) : qrCode ? (
            <Image 
              src={qrCode}
              alt="Código QR para WhatsApp"
              boxSize="100%"
              objectFit="cover"
            />
          ) : (
            <Text>Cargando QR...</Text>
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
            <Tab onClick={() => setTableSelect("0")}>Clientes sin Whats App</Tab>
            <Tab onClick={() => setTableSelect("1")}>Clientes con Plan PA01</Tab>
            <Tab onClick={() => setTableSelect("2")}>Clientes otros Planes</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {isLoading ? (
                <Text>Cargando datos...</Text>
              ) : (
                <>
                <ExcelTable excelData={noWhatsappClients.data} />
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
                <ExcelTable excelData={pa01PlanClients.data} />
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
                  <ExcelTable excelData={otherPlansClients.data} />
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
