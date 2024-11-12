import React, { useEffect, useState } from 'react';
import { Box, Button, Text, useToast, Flex } from '@chakra-ui/react';
import { useGlobalContext } from '@/app/providers/GlobalContext';
import { getFetchQRCode, getIsLoggedIn, uploadExcelFile } from '@/app/services/apiService';
import QrCodeDisplay from './QRCodeDisplay';

interface FilterComponentProps {
  onFilter: (fileWithoutWhatsApp: string, fileWithWhatsApp: string) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ onFilter }) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toast = useToast();
  const { accessToken, excelFileByUser } = useGlobalContext();
  let qrTimer: NodeJS.Timeout | null = null;

  const checkLoginStatusAndFetchQRCode = async () => {
    try {
      const { isLoggedIn } = await getIsLoggedIn(accessToken || "");
      if (isLoggedIn) {
        setIsButtonDisabled(false);
        setIsModalOpen(false);
        return;
      }
      
      // Fetch QR code if not logged in
      const qrBase64 = await getFetchQRCode(accessToken || "");
      if (qrBase64) {
        setQrCode(qrBase64);
        setIsButtonDisabled(true);
        qrTimer = setTimeout(checkLoginStatusAndFetchQRCode, 60000);
      }
    } catch (error) {
      console.error('Error checking login status or fetching QR code:', error);
    } finally {
      setIsLoadingQr(false);
    }
  };

  const createFormData = () => {
    const formData = new FormData();
    if (excelFileByUser) {
      const blob = new Blob([JSON.stringify(excelFileByUser)], { type: 'application/json' });
      formData.append('file', blob, `${excelFileByUser.fileName}.json`);
    }
    return formData;
  };

  const handleFileUpload = async () => {
    try {
      const formData = createFormData();
      const response = await uploadExcelFile('/upload/excel', formData, accessToken || "");

      if (response.fileWithWhatsApp && response.fileWithoutWhatsApp) {
        toast({
          title: 'Archivo procesado con éxito',
          description: 'Los archivos resultantes están listos para descargar.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onFilter(response.fileWithoutWhatsApp, response.fileWithWhatsApp);
      }
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al procesar el archivo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFilterData = () => {
    if (!isButtonDisabled) {
      handleFileUpload();
    } else {
      setIsModalOpen(true);
      checkLoginStatusAndFetchQRCode();
    }
  };

  useEffect(() => {
    return () => {
      if (qrTimer) clearTimeout(qrTimer); // Limpiar el temporizador cuando el componente se desmonta
    };
  }, []);

  return (
    <Flex 
      height="14rem" 
      p={6} 
      border="1px" 
      borderColor="gray.300" 
      borderRadius="md" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center"
    >
      {isModalOpen && qrCode && (
        <QrCodeDisplay
          qrCode={qrCode}
          isLoadingQr={isLoadingQr}
          isModalOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onQrScanSuccess={() => {
            setIsButtonDisabled(false);
            setIsModalOpen(false);
          }}
        />
      )}
      <Button onClick={handleFilterData} isDisabled={isButtonDisabled} colorScheme="blue">
        Filtrar archivo
      </Button>
    </Flex>

  );
};

export default FilterComponent;
