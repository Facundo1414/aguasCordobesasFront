// components/Navbar.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Grid, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import UploadIcon from '@mui/icons-material/CloudUpload';
import TestIcon from '@mui/icons-material/Science';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ background: "#0FA3B1", color: "white" }}>
      <Toolbar>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={2}>
            <Typography variant="h6" component="div" sx={{ paddingLeft: "1rem" }}>
              LOGO
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Box display="flex" justifyContent="left" className="font-extrabold space-x-8">
              <Button color="inherit" component={Link} to="/" startIcon={<HomeIcon />} sx={{ fontSize: '1.2rem', mx: 2 }}>
                Inicio
              </Button>
              <Button color="inherit" component={Link} to="/upload" startIcon={<UploadIcon />} sx={{ fontSize: '1.2rem', mx: 2 }}>
                Subir archivos
              </Button>
              <Button color="inherit" component={Link} to="/test" startIcon={<TestIcon />} sx={{ fontSize: '1.2rem', mx: 2 }}>
                Testear UF
              </Button>
              <Button color="inherit" component={Link} to="/test" startIcon={<TestIcon />} sx={{ fontSize: '1.2rem', mx: 2 }}>
                Testear UF
              </Button>
            </Box>
          </Grid>
          <Grid item xs={1}>
            <Avatar sx={{ bgcolor: "black", fontSize: '1.2rem' }}>
              <AccountCircleIcon />
            </Avatar>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
