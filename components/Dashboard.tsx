// components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
      <Box sx={{ display: 'flex' }} className="h-screen bg-green-400">
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }} className="bg-slate-400">
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
