import React, { useState, useEffect } from 'react';
import { useToast, Flex } from '@chakra-ui/react';
import { getFetchQRCode } from '@/app/services/apiService';
import { useGlobalContext } from '@/app/providers/GlobalContext';
import QrCodeDisplay from '../filterPageComponents/QRCodeDisplay';

interface Servicio2ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Servicio2Modal: React.FC<Servicio2ModalProps> = ({ isOpen, onClose }) => {
  const { accessToken } = useGlobalContext();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(true);
  const toast = useToast();
  let qrTimer: NodeJS.Timeout | null = null;

  const getToken = () => accessToken || localStorage.getItem('accessToken') || '';

  const checkLoginStatusAndFetchQRCode = async () => {
    try {
      const token = getToken();
      const qrBase64 = await getFetchQRCode(token);
      if (qrBase64) {
        setQrCode(qrBase64);
        qrTimer = setTimeout(checkLoginStatusAndFetchQRCode, 60000);
      }
    } catch (error) {
      console.error('Error obteniendo código QR:', error);
    } finally {
      setIsLoadingQr(false);
    }
  };

  useEffect(() => {
    if (isOpen) checkLoginStatusAndFetchQRCode();
    return () => {
      if (qrTimer) clearTimeout(qrTimer);
    };
  }, [isOpen]);

  return (
    isOpen && (
      <Flex flexDirection="column" alignItems="center">
        <QrCodeDisplay
          qrCode={qrCode}
          isLoadingQr={isLoadingQr}
          isModalOpen={isOpen}
          onClose={onClose}
          onQrScanSuccess={() => {
            toast({
              title: 'Inicio de sesión exitoso',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            onClose();
          }}
        />
      </Flex>
    )
  );
};

export default Servicio2Modal;
