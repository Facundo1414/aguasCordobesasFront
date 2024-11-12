// ModalEnDesarrollo.tsx
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Image,
  Button,
} from '@chakra-ui/react';

interface ModalEnDesarrolloProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalEnDesarrollo: React.FC<ModalEnDesarrolloProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Servicio en Desarrollo</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="center">
          <Image src="/logoWater.png" alt="Logo" boxSize="300px" mx="auto" my={4} />
          <Text fontSize="lg" mb={4}>
            Este servicio está actualmente en desarrollo. Pronto estará disponible.
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalEnDesarrollo;
