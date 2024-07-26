// pages/UploadPage.tsx
import { useCallback, useState } from 'react';
import { Typography, Button, Box, Paper } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { uploadData } from "../services/apiService";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      
      try {
        const response = await uploadData('/upload/excel', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }} className={"h-screen"}>
      <Typography variant="h4" gutterBottom>
        Subir datos de los clientes
      </Typography>
      <form onSubmit={handleSubmit}>
        <Paper elevation={6} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} {...getRootProps()}>
          <input {...getInputProps()} />
          {
            !file ? (
              <Typography variant="body1" align="center">
                Arrastra y suelta un archivo aquí, o haz clic para seleccionar un archivo (acepta .xlsx, .xls)
              </Typography>
            ) : (
              <Typography variant="body1" align="center">
                {file.name}
              </Typography>
            )
          }
        </Paper>
        {file && (
          <Box sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Subir archivo
            </Button>
          </Box>
        )}
      </form>
    </Box>
  );
}
