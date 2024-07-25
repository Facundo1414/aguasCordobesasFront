// pages/TestPage.tsx
import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { get } from '../services/apiService'; 

const TestPage = () => {
  const [response, setResponse] = useState<any | null>(null);

  const handleCheckHealth = async () => {
    try {
      const result = await get('health');
      setResponse(result);
    } catch (error) {
      console.error('Error checking health:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }} className={"h-screen"}>
      <Typography variant="h4" gutterBottom>
        Página de Testeo
      </Typography>
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
          <Typography variant="body1" dangerouslySetInnerHTML={{ __html: response }} />
        </Box>
      )}
    </Box>
  );
};

export default TestPage;
