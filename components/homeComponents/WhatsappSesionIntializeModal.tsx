import React, { useState, useEffect, useCallback } from 'react';
import { useToast, Flex, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@chakra-ui/react';
import { getIsLoggedIn, initializeWhatsAppSession } from '@/app/services/apiService';
import { useGlobalContext } from '@/app/providers/GlobalContext';
import QrCodeDisplay from '../filterPageComponents/QRCodeDisplay';

interface WhatsappSesionIntializeProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_QR_ATTEMPTS = 5; // Máximo número de intentos para obtener el código QR

const WhatsappSesionIntialize: React.FC<WhatsappSesionIntializeProps & { setIsSessionReady: (value: boolean) => void }> = ({ isOpen, onClose, setIsSessionReady }) => {
  const { accessToken } = useGlobalContext();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(true);
  const [isSessionReady, setIsSessionReadyInternal] = useState(false);
  const toast = useToast();

  const initializeWsp = useCallback(async () => {
    const getToken = () => accessToken || localStorage.getItem('accessToken') || '';

    try {
      const responsecheck = await getIsLoggedIn(getToken());
      if (responsecheck.isLoggedIn) {
        setIsSessionReady(true); // Establecer sesión lista
        setIsSessionReadyInternal(true);
        setQrCode(null);
        setIsLoadingQr(false);
        toast({
          title: 'Sesión en WhatsApp ya iniciada.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      } else {
        const response = await initializeWhatsAppSession(getToken());
        if (response?.message === "ok" || response?.message === "Sesión de WhatsApp inicializada") {
          setIsSessionReady(true);
          setIsSessionReadyInternal(true);
          setQrCode(null);
          setIsLoadingQr(false);
          toast({
            title: 'Sesión en WhatsApp iniciada con éxito.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } else if (response?.qrCode) {
          setQrCode(response.qrCode);
          setIsLoadingQr(false);
        }
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
    if (isOpen) {
      initializeWsp();
    }
  }, [isOpen, initializeWsp]);

  return (
    isOpen && (
      <Flex flexDirection="column" alignItems="center">
        {isSessionReady ? (
          // Si la sesión está lista, mostramos el mensaje
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent boxSize={500}>
              <ModalHeader>Sesión activa en WhatsApp</ModalHeader>
              <ModalBody display="flex" justifyContent="center" alignItems="center">
                <Text fontSize="lg">No es necesario iniciar sesión nuevamente.</Text>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="red" onClick={onClose}>Cerrar</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        ) : (
          // Si no está lista, mostramos el QR
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
        )}
      </Flex>
    )
  );
};

export default WhatsappSesionIntialize;
