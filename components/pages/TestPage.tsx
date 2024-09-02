import React, { useState } from 'react';
import { Box, Heading, Button, Text } from '@chakra-ui/react';
import { get } from '../../services/apiService';

const TestPage = () => {
  const [response, setResponse] = useState<string | null>(null);

  const handleCheckHealth = async () => {
    try {
      // Asegúrate de que `get('health')` devuelva un string
      const result = await get('health');
      
      // Verifica el tipo de `result`
      if (typeof result === 'string') {
        setResponse(result); // Actualiza el estado con la respuesta del backend
      } else {
        console.error('La respuesta del servidor no es un texto válido.');
        setResponse(null); // Limpia la respuesta en caso de error
      }
    } catch (error) {
      console.error('Error checking health:', error);
      setResponse(null); // Limpia la respuesta en caso de error
    }
  };

  return (
    <Box p={4} h="100vh">
      <Heading as="h1" size="xl" mb={4}>
        Página de Testeo
      </Heading>
      <Button
        onClick={handleCheckHealth}
        colorScheme="teal"
        mb={4}
      >
        Verificar Salud del Backend
      </Button>
      {response && (
        <Box mt={4}>
          <Text as="div" dangerouslySetInnerHTML={{ __html: response }} />
        </Box>
      )}
    </Box>
  );
};

export default TestPage;
