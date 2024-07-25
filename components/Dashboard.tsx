// components/Dashboard.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import HomePage from '@/pages/HomePage';
import UploadPage from '@/pages/UploadPage';
import TestPage from '@/pages/TestPage';

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Router>
      <Box className="h-screen">
        <Navbar />
        <Box component="main" sx={{ p: 3, background: "#F9F7F3" }}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}
