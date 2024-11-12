// QrCodeDisplay.tsx
import React from 'react';
import { Image, Spinner, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@chakra-ui/react';

interface QrCodeDisplayProps {
  qrCode: string | null;
  isLoadingQr: boolean;
  isModalOpen: boolean;
  onClose: () => void;
  onQrScanSuccess: () => void;
}

const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({ qrCode, isLoadingQr, isModalOpen, onClose, onQrScanSuccess }) => {
  return (
    <Modal isOpen={isModalOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent boxSize={500}>
        <ModalHeader>Escanea el código QR para iniciar sesión en WhatsApp</ModalHeader>
        <ModalBody display="flex" justifyContent="center" alignItems="center">
          {isLoadingQr ? (
            <Spinner />
          ) : qrCode ? (
            <Image src={`${qrCode}`} alt="Código QR" onClick={onQrScanSuccess} />
          ) : (
            <Text>No se pudo obtener el código QR.</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default QrCodeDisplay;
