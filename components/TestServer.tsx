import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { get } from '../services/apiService'; // Asegúrate de que tu servicio esté configurado para usar Axios
import { AxiosResponse } from 'axios'; // Asegúrate de que Axios esté instalado

const TestServer = () => {
  const [response, setResponse] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckHealth = async () => {
    try {
      const result: AxiosResponse<string> = await get('health', {
        responseType: 'text', // Asegúrate de que Axios sepa que la respuesta es texto
      });
      setResponse(result); // Actualiza el estado con el contenido de la respuesta
      setError(null); // Limpiar el error en caso de éxito
    } catch (error) {
      console.error('Error checking health:', error);
      setResponse(null); // Limpiar la respuesta exitosa en caso de error
      setError('Error con la conexión al servidor.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button
        onClick={handleCheckHealth}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Verificar Salud del Backend
      </Button>
      {response && (
        <Box sx={{ mt: 2 }}>
          {/* Mostrar HTML seguro */}
          <Typography variant="body1" component="div" dangerouslySetInnerHTML={{ __html: response }} />
        </Box>
      )}
      {error && (
        <Box sx={{ mt: 2, color: 'red' }}>
          <Typography variant="body1">
            {error}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TestServer;
