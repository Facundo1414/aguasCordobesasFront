import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  useToast,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepTitle,
  StepSeparator,
  StepDescription,
  useSteps,
  StepIcon,
  StepNumber,
} from '@chakra-ui/react';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';
import { useGlobalContext } from '@/app/providers/GlobalContext';
import { columns, emptyRow, ExcelRow, steps } from '../extra/typesSendFilterProcessPage';
import FilterComponent from '../filterPageComponents/FilterComponent';
import FileUploadForm from '../filterPageComponents/FileUploadForm';
import ProcessComponent from '../filterPageComponents/ProcessComponent';
import ScrapeComponent from '../filterPageComponents/ScrapeComponent';
import FinalizeProcessComponent from '../filterPageComponents/FinalizeProcessComponent';



export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<ExcelRow[] | null>(null);
  const [fileProcessed, setFileProcessed] = useState<File | null>(null);
  const toast = useToast();
  const { setExcelFileByUser } = useGlobalContext();
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  // Campos para ProcessComponent
  const [fileWithoutWhatsApp, setFileWithoutWhatsApp] = useState<string | null>(null);
  const [fileWithWhatsApp, setFileWithWhatsApp] = useState<string | null>(null);

  // para la tabla
  const handleFileChange = (file: File | Blob) => {
    const isFile = file instanceof File;
    setFile(isFile ? file : null); // Set file only if it’s an actual File instance
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: ExcelRow[] = (XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][])
        .map((row) => ({
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
        }));
  
      setExcelData(json);
  
      setExcelFileByUser({
        data: json,
        fileName: isFile ? file.name : "Filtered Data",
        isSentOrUsed: false,
      });
    };
    reader.readAsArrayBuffer(file);
  };

  // para filterComponent
  const handleFilterResults = (fileWithoutWhatsApp: string, fileWithWhatsApp: string ) => {
    setFileWithoutWhatsApp(fileWithoutWhatsApp);
    setFileWithWhatsApp(fileWithWhatsApp);
    setActiveStep(2);
  };
  
  // para uploadComponent
  const handleFilterClick = () => {
    if (!file) {
      toast({
        title: 'No has subido un archivo.',
        description: 'Por favor, sube un archivo para continuar.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } else {
      setActiveStep(1);  // Procede si hay un archivo
    }
  };
  

  // Función para manejar el archivo procesado para Scrape Component
  const handleFileProcessed = (file: File | null) => {
    if (file) {
      
      setFileProcessed(file);
      setActiveStep(4);
    }

  };



  const handleCancel = () => {
    setFile(null);
    setExcelData(null);
    setActiveStep(0);
    toast({
      title: 'Carga cancelada.',
      description: 'El proceso de carga ha sido cancelado.',
      status: 'warning',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const dataToShow = excelData && excelData.length > 1 ? excelData.slice(1) : Array(10).fill(emptyRow);

  return (
    <Box p={4} h="screen" bg="gray.50">
      <Heading as="h1" size="xl" mb={4} color="gray.800">
        {activeStep !== 4 ? (
          steps[activeStep].title
        ) : (
          'Descargar Archivos'
        )}
      </Heading>
      <Stepper index={activeStep} mb={8} colorScheme='green'>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
              />
              </StepIndicator>
              
              <Box flexShrink='0'>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
              </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <Flex w="80%" mx="auto" my="4rem" justifyContent={"center"}>
        {activeStep === 0 && 
          <FileUploadForm             
          file={file} 
          onFileChange={handleFileChange} 
          onFilterClick={handleFilterClick} 
          onCancel={handleCancel}  />}

        {activeStep === 1 && 
          <FilterComponent 
            onFilter={handleFilterResults}
            handleBack={handleBack}
            />
            }

        {activeStep === 2 && 
          <ProcessComponent
            onProcess={() => setActiveStep(3)}
            fileWithoutWhatsApp={fileWithoutWhatsApp}
            fileWithWhatsApp={fileWithWhatsApp}
            onExcelDataUpdate={setExcelData}
            handleFileChange={handleFileChange}
            handleBack={handleBack}
            />}
        
        {activeStep === 3 && 
          <ScrapeComponent
            onProcess={() => setActiveStep(4)} 
            filePath={fileWithWhatsApp || ''}
            onFileProcessed={handleFileProcessed}
            handleBack={handleBack}
            />
          }

        {activeStep === 4 && 
          <FinalizeProcessComponent
            fileWithoutWhatsApp={fileWithoutWhatsApp}
            fileWithWhatsApp={fileWithWhatsApp}
            fileProcessed={fileProcessed}
            handleFileChange={handleFileChange}
            />
          }  
      </Flex>


      <Box mb={2}>
        <DataTable
          columns={columns}
          data={dataToShow}
          pagination
          highlightOnHover={true}

          customStyles={{
            table: {
              style: {
                border: '1px solid gray',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0px 0px 5px rgba(0,0,0,0.1)',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}
