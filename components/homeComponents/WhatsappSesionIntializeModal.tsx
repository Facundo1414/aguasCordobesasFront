import React, { useState, useEffect, useCallback } from 'react';
import { useToast, Flex, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from '@chakra-ui/react';
import { fetchQrCode, getIsLoggedIn } from '@/app/services/apiService';
import { useGlobalContext } from '@/app/providers/GlobalContext';
import QrCodeDisplay from '../filterPageComponents/QRCodeDisplay';

interface WhatsappSesionIntializeProps {
  isOpen: boolean;
  onClose: () => void;
}

const WhatsappSesionIntialize: React.FC<WhatsappSesionIntializeProps & { setIsSessionReady: (value: boolean) => void }> = ({ isOpen, onClose, setIsSessionReady }) => {
  const { accessToken } = useGlobalContext();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(true);
  const [isSessionReady, setIsSessionReadyInternal] = useState(false);
  const toast = useToast();

  const showToast = (title: string, description: string, status: 'info' | 'success' | 'error') => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSessionActive = () => {
    setIsSessionReady(true);
    setIsSessionReadyInternal(true);
    setQrCode(null);
    setIsLoadingQr(false);
    showToast('Sesión en WhatsApp ya iniciada.', '', 'info');
  };

  const initializeWsp = useCallback(async () => {
    const token = accessToken || localStorage.getItem('accessToken') || '';

    try {

      if (isSessionReady) {
        handleSessionActive();
      } else {
        const qrResponse = await fetchQrCode(token);

        if (qrResponse) {
          setQrCode(qrResponse);
          setIsLoadingQr(false);
        } else {
          setIsLoadingQr(false);
          showToast('Error al obtener el QR.', '', 'error');
        }
      }
    } catch (error) {
      console.error('Error en la inicialización de WhatsApp:', error);
      showToast('Error al iniciar sesión en WhatsApp', 'Intente nuevamente más tarde.', 'error');
    }
  }, [accessToken]);

  useEffect(() => {
    if (isOpen) {
      initializeWsp();
    }
  }, [isOpen, initializeWsp]);

  return (
    isOpen && (
      <Flex flexDirection="column" alignItems="center">
        {isSessionReady ? (
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Sesión activa en WhatsApp</ModalHeader>
              <ModalBody>
                <Text fontSize="lg">No es necesario iniciar sesión nuevamente.</Text>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="red" onClick={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        ) : (
          <>
            <QrCodeDisplay
              qrCode={qrCode}
              isLoadingQr={isLoadingQr}
              isModalOpen={isOpen}
              onClose={onClose}
              onQrScanSuccess={() => {
                showToast('Inicio de sesión exitoso', '', 'success');
                setIsSessionReady(true);
                onClose();
              }}
            />
            {isLoadingQr && <Spinner size="lg" />}
          </>
        )}
      </Flex>
    )
  );
};

export default WhatsappSesionIntialize;
