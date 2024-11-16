import React, { useState, useEffect, useCallback } from 'react';
import { useToast, Flex, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@chakra-ui/react';
import { getIsLoggedIn, initializeWhatsAppSession } from '@/app/services/apiService';
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

  const initializeWsp = useCallback(async () => {
    const getToken = () => accessToken || localStorage.getItem('accessToken') || '';

    try {
      const responsecheck = await getIsLoggedIn(getToken());
      if (responsecheck.isLoggedIn) {
        // Si ya está logueado, no necesitamos mostrar el QR y solo mostramos el mensaje de sesión activa
        setIsSessionReady(true);
        setQrCode(null); // El QR ya no es necesario
        setIsLoadingQr(false);
        toast({
          title: 'Sesión en WhatsApp ya iniciada.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Si no está logueado, obtenemos el QR
        const response = await initializeWhatsAppSession(getToken());
        if (response?.message === "ok") {
          setIsSessionReady(true); 
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

export default Servicio2Modal;
