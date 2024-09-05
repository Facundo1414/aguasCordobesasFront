import React, { useState } from 'react';
import { Box, Button, Flex, Table, Tbody, Td, Th, Thead, Tr, Text } from '@chakra-ui/react';

interface ExcelTableProps {
  excelData: any[][] | null;
}

const ExcelTable: React.FC<ExcelTableProps> = ({excelData}) => {
  // Start slicing from the second row (index 1) to ignore the first row
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const endIndex = startIndex + rowsPerPage;
  const displayedData = excelData ? excelData.slice(startIndex, endIndex) : [];

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil((excelData?.length || 0) / rowsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Box maxWidth="100%" border="1px" borderColor="gray.300" mb={12} >
      <Box height="full">
        <Table variant="simple" colorScheme="gray" width="100%" height="full">
          <Thead bg="blue.700" position="sticky" top={0} zIndex={1}>
            <Tr>
              <Th width="5%" color="white" borderRight="1px" borderColor="gray.200">Unidad</Th>
              <Th width="15%" color="white" borderRight="1px" borderColor="gray.200">Telefono Unidad</Th>
              <Th width="15%" color="white" borderRight="1px" borderColor="gray.200">Telefono Cliente</Th>
              <Th width="5%" color="white" borderRight="1px" borderColor="gray.200">Columna Vacia</Th>
              <Th width="5%" color="white" borderRight="1px" borderColor="gray.200">Tipo Plan</Th>
              <Th width="5%" color="white" borderRight="1px" borderColor="gray.200">Cantidad Vencidas</Th>
              <Th width="5%" color="white" borderRight="1px" borderColor="gray.200">Cantidad Cuotas</Th>
              <Th width="25%" overflowX="hidden" color="white" borderRight="1px" borderColor="gray.200">Cliente</Th>
            </Tr>
          </Thead>
          <Tbody>
            {excelData ? (
              displayedData.map((row, rowIndex) => (
                <Tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <Td
                      key={cellIndex}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      borderColor="gray.600"
                      maxWidth={cellIndex === 7 ? "150px" : "100px"}
                    >
                      {cellIndex === 3 ? "" : cell}
                    </Td>
                  ))}
                </Tr>
              ))
            ) : (
              Array.from({ length: 7 }).map((_, index) => (
                <Tr key={index}>
                  <Td borderColor="gray.600">Unidad {index + 1}</Td>
                  <Td borderColor="gray.600">123456789</Td>
                  <Td borderColor="gray.600">987654321</Td>
                  <Td borderColor="gray.600">""</Td>
                  <Td borderColor="gray.600">PA01</Td>
                  <Td borderColor="gray.600">10</Td>
                  <Td borderColor="gray.600">5</Td>
                  <Td borderColor="gray.600" maxWidth="150px">Cliente {index + 1}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      {excelData && excelData.length > rowsPerPage ? (
        <Flex justify="space-between" alignItems="center" paddingX={6} my={4}>
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            mr={2}
            bg={"blue.300"}

          >
            Anterior
          </Button>
          <Text>
            Página {currentPage} de {Math.ceil((excelData.length - 1) / rowsPerPage)}
          </Text>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil((excelData.length - 1) / rowsPerPage)}
            ml={2}
            bg={"blue.300"}

          >
            Siguiente
          </Button>
        </Flex>
      ):(
        <Flex justify="space-between" alignItems="center" paddingX={6} my={4}>
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            mr={2}
            bg={"blue.300"}
          >
            Anterior
          </Button>
          <Text>
            Página {1} de {1}
          </Text>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil((2) / rowsPerPage)}
            ml={2}
            bg={"blue.300"}
          >
            Siguiente
          </Button>
        </Flex>      )}
      </Box>
    </Box>
  );
};

export default ExcelTable;
