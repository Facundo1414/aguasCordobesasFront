import React from 'react';
import { Box, Grid, GridItem, Heading, Text } from '@chakra-ui/react';
import TestServer from '@/components/TestServer';

export default function HomePage() {
  return (
    <Box p={4} h="100vh" bg="gray.100">
      <Heading as="h1" size="xl" mb={4} color="gray.800">
        INICIO
      </Heading>
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <GridItem colSpan={12}>
          <Box p={4} borderRadius="lg" bg="white" shadow="lg">
            <Heading as="h2" size="lg" mb={4} color="blue.500">
              Título Principal
            </Heading>
            <Box mt={4} minH="15rem" color="gray.600">
              Contenido del Paper principal
            </Box>
          </Box>
        </GridItem>
        <GridItem colSpan={[12, 6]}>
          <Box p={4} borderRadius="lg" bg="white" shadow="lg">
            <Heading as="h2" size="lg" mb={4} color="blue.500">
              Testear Servidor
            </Heading>
            <Box mt={4} minH="10rem" color="gray.600">
              <TestServer />
            </Box>
          </Box>
        </GridItem>
        <GridItem colSpan={[12, 6]}>
          <Box p={4} borderRadius="lg" bg="white" shadow="lg">
            <Heading as="h2" size="lg" mb={4} color="blue.500">
              Como usar la pagina?
            </Heading>
            <Box mt={4} minH="10rem" color="gray.600">
              VIDEO tutorial
            </Box>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}
