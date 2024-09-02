import React, { useState } from 'react';
import { Box, Button, Flex, Heading, Table, TableCaption, Tbody, Td, Th, Thead, Tr, Text } from '@chakra-ui/react';
import { FileUploader } from 'react-drag-drop-files';
import * as XLSX from 'xlsx';
import { uploadData } from "../../services/apiService";

const fileTypes = ["XLS", "XLSX"];

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<any[][] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const handleFileChange = (file: File) => {
    setFile(file);
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
        setCurrentPage(1);
      } else {
        alert('El archivo Excel no contiene datos o tiene un formato incorrecto.');
        setFile(null);
        setExcelData(null);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await uploadData('/upload/excel', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedData = excelData ? excelData.slice(startIndex, endIndex) : [];

  return (
    <Box p={4} h="100vh" bg="gray.50">
      <Heading as="h1" size="xl" mb={4} color="gray.800">
        Subir datos de los clientes
      </Heading>
      <form onSubmit={handleSubmit}>
        <Box p={12} border="1px" borderColor="gray.300" rounded="lg" shadow="md" display="flex" flexDirection="column" alignItems="center">
          <FileUploader handleChange={handleFileChange} name="file" types={fileTypes} />
          {file && (
            <Text textAlign="center" color="blue.600" mt={4}>
              {file.name}
            </Text>
          )}
        </Box>
        {file && (
          <Flex justify="flex-end" mt={4}>
            <Button type="submit" bg="green.500" color="white" px={4} py={2} rounded="lg" _hover={{ bg: "green.600" }}>
              Subir archivo
            </Button>
          </Flex>
        )}
      </form>

      <Box my={6} borderBottom="2px" borderColor="gray.300" />

      <Heading as="h3" size="lg" mb={4} color="blue.700">
        {excelData ? 'Datos del archivo subido:' : 'El formato del excel a subir debería coincidir con la siguiente tabla'}
      </Heading>

      <Box overflowX="auto">
        <Box position="relative">
          <Box overflowY="auto" height="600px">
            <Table variant="striped" colorScheme="gray">
              <Thead bg="blue.700">
                <Tr>
                  <Th color="white">Unidad</Th>
                  <Th color="white">Telefono_Unidad</Th>
                  <Th color="white">Telefono_Cliente</Th>
                  <Th color="white">Columna Vacia</Th>
                  <Th color="white">Tipo_Plan</Th>
                  <Th color="white">Cant_Venci</Th>
                  <Th color="white">Cant_Venci</Th>
                  <Th color="white">Cliente</Th>
                </Tr>
              </Thead>
              <Tbody>
                {excelData ? (
                  displayedData.map((row, rowIndex) => (
                    <Tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <Td key={cellIndex}>
                          {cellIndex === 3 ? "" : cell}
                        </Td>
                      ))}
                    </Tr>
                  ))
                ) : (
                  Array.from({ length: 5 }).map((_, index) => (
                    <Tr key={index}>
                      <Td>Ejemplo {index + 1}</Td>
                      <Td>123456789</Td>
                      <Td>987654321</Td>
                      <Td>""</Td>
                      <Td>PA01</Td>
                      <Td>10</Td>
                      <Td>5</Td>
                      <Td>Cliente {index + 1}</Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Box>
          {excelData && excelData.length > rowsPerPage && (
            <Flex position="absolute" bottom={0} left={0} right={0} bg="white" p={2} justify="space-between" align="center" borderTop="1px" borderColor="gray.300">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                bg="blue.500"
                color="white"
                px={4}
                py={2}
                rounded="lg"
                _hover={{ bg: "blue.700" }}
              >
                Anterior
              </Button>
              <Text>
                Página {currentPage} de {Math.ceil(excelData.length / rowsPerPage)}
              </Text>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === Math.ceil(excelData.length / rowsPerPage)}
                bg="blue.500"
                color="white"
                px={4}
                py={2}
                rounded="lg"
                _hover={{ bg: "blue.700" }}
              >
                Siguiente
              </Button>
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
  );
}
