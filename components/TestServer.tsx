import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { get } from '../services/apiService'; // Asegúrate de que tu servicio esté configurado para usar Axios
import { AxiosResponse } from 'axios'; // Asegúrate de que Axios esté instalado

const TestServer = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckHealth = async () => {
    try {
      const result: AxiosResponse = await get('health');
      // Asegúrate de que 'result.data' contenga el mensaje que deseas mostrar
      setResponse(result.data); // Actualiza el estado con el contenido de la respuesta
      setError(null); // Limpiar el error en caso de éxito
    } catch (error) {
      console.error('Error checking health:', error);
      setResponse(null); // Limpiar la respuesta exitosa en caso de error
      setError('Error con la coneccion al servidor.');
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
          <Typography variant="body1">
            {response}
          </Typography>
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
