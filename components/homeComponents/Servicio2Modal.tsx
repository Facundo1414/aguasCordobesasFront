import React, { useState, useEffect, useCallback } from 'react';
import { useToast, Flex } from '@chakra-ui/react';
import { initializeWhatsAppSession } from '@/app/services/apiService';
import { useGlobalContext } from '@/app/providers/GlobalContext';
import QrCodeDisplay from '../filterPageComponents/QRCodeDisplay';

interface Servicio2ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_QR_ATTEMPTS = 5; // Máximo número de intentos para obtener el código QR

const Servicio2Modal: React.FC<Servicio2ModalProps> = ({ isOpen, onClose }) => {
  const { accessToken } = useGlobalContext();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(true);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const toast = useToast();
  let qrTimer: NodeJS.Timeout | null = null;


  const initializeWsp = useCallback(async () => {
    const getToken = () => accessToken || localStorage.getItem('accessToken') || '';

    try {
      const response = await initializeWhatsAppSession(getToken());
      if (response?.message == "ok") {
        setIsSessionReady(true); 
        setQrCode(null);
        setIsLoadingQr(false);
        toast({
          title: 'Sesión en WhatsApp iniciada con exito.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

      } else if (response?.qrCode) {
        setQrCode(response.qrCode);
        setIsLoadingQr(false);
      }
    } catch (error) {
      console.error('Error en la inicialización de WhatsApp:', error);
      toast({
        title: 'Error al iniciar sesión en WhatsApp',
        description: 'Intente nuevamente más tarde.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [accessToken, toast]);

  useEffect(() => {
    let qrTimer: NodeJS.Timeout | null = null;
    if (isOpen) {
      initializeWsp(); 
    }
    return () => {
      if (qrTimer) clearTimeout(qrTimer);
    };
  }, [isOpen,initializeWsp]);

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
            setIsSessionReady(true);
            onClose();
          }}
        />
      </Flex>
    )
  );
};

export default Servicio2Modal;
