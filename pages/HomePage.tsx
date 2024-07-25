// pages/HomePage.tsx
import React from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 300, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 200, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 278, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 189, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 239, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 349, pv: 4300, amt: 2100 },
];

export default function HomePage() {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Home
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Cantidad de Algo
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box className={"h-full"} sx={{ p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ver Tutorial
            </Typography>
            <Button variant="contained" color="primary">
              Ver Tutorial
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Otra Caja
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Otra Caja
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Otra Caja
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Otra Caja
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
