// pages/HomePage.tsx
import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import TestServer from '@/components/TestServer';

export default function HomePage() {
  return (
    <Box  className={"h-screen"}>
      <Typography variant="h4" gutterBottom>
        INICIO
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={6} sx={{ p: 2, borderRadius: 2, bgcolor: "#B5E2FA" }}>
            <Typography variant="h6" gutterBottom>
              Título Principal
            </Typography>
            <Box sx={{ mt: 2, minHeight: "15rem" }}>
              {/* Aquí puedes agregar contenido */}
              Contenido del Paper principal
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ p: 2, borderRadius: 2, bgcolor: "#B5E2FA" }}>
            <Typography variant="h6" gutterBottom>
              Testear Servidor
            </Typography>
            <Box sx={{ mt: 2, minHeight: "10rem" }}>
              <TestServer/>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ p: 2, borderRadius: 2, bgcolor: "#B5E2FA" }}>
            <Typography variant="h6" gutterBottom>
              Como usar la pagina?
            </Typography>
            <Box sx={{ mt: 2, minHeight: "10rem" }}>
              {/* Aquí puedes agregar contenido */}
              VIDEO tutorial
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}