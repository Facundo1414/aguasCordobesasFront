import React, { useState } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import { get } from '../services/apiService'; // Asegúrate de que tu servicio esté configurado para usar Axios
import { AxiosResponse } from 'axios'; // Asegúrate de que Axios esté instalado

const TestServer = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckHealth = async () => {
    try {
      const result: AxiosResponse<string> = await get('health', {
        responseType: 'text', // Asegúrate de que Axios sepa que la respuesta es texto
      });
      setResponse(result.data); // Actualiza el estado con el contenido de la respuesta
      setError(null); // Limpiar el error en caso de éxito
    } catch (error) {
      console.error('Error checking health:', error);
      setResponse(null); // Limpiar la respuesta exitosa en caso de error
      setError('Error con la conexión al servidor.');
    }
  };

  return (
    <Box p={4}>
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
      {error && (
        <Box mt={4} color="red.500">
          <Text>
            {error}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default TestServer;
