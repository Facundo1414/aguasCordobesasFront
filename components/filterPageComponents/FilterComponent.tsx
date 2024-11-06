import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Image,
  ModalFooter,
  Flex,
} from '@chakra-ui/react';
import { useGlobalContext } from '@/app/providers/GlobalContext';
import { checkLoginWsp, getFetchQRCode, uploadExcelFile } from '@/app/services/apiService';

// Definición de las propiedades que recibe el componente
interface FilterComponentProps {
  onFilter: (fileWithoutWhatsApp: string, fileWithWhatsApp: string) => void; // Función que se ejecutará tras el filtrado
}

// Componente funcional FilterComponent
const FilterComponent: React.FC<FilterComponentProps> = ({ onFilter }) => {
  // Estado local para manejar el estado del botón, login y QR
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Toast para mostrar mensajes al usuario
  const toast = useToast();
  
  // Obtiene el token de acceso y el archivo Excel del contexto global
  const { accessToken, excelFileByUser } = useGlobalContext();

  /**
   * Verifica el estado de inicio de sesión en WhatsApp y obtiene el código QR
   * en caso de que el usuario no esté logueado.
   */
  const checkLoginStatusAndFetchQRCode = async () => {
    setIsLoadingQr(true);
    try {
      // Verifica el estado de login
      const loginResponse = await checkLoginWsp(accessToken || "");
      setIsLoggedIn(loginResponse.isLoggedIn);
      setIsButtonDisabled(!loginResponse.isLoggedIn);
      
      // Si no está logueado, obtiene el código QR
      if (!loginResponse.isLoggedIn) {
        const qrBlob = await getFetchQRCode(accessToken || "");
        if (qrBlob) {
          // Crea una URL para el código QR
          setQrCode(URL.createObjectURL(qrBlob));
        } else {
          console.error('Failed to fetch QR code');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoadingQr(false);
    }
  };

  // Ejecuta la verificación de login al montar el componente
  useEffect(() => {
    checkLoginStatusAndFetchQRCode();
  }, []);

  /**
   * Crea un objeto FormData para subir el archivo Excel.
   */
  const createFormData = () => {
    const formData = new FormData();
    if (excelFileByUser) {
      const blob = new Blob([JSON.stringify(excelFileByUser)], { type: 'application/json' });
      formData.append('file', blob, `${excelFileByUser.fileName}.json`);
    }
    return formData;
  };

  /**
   * Maneja la subida del archivo Excel y procesa el archivo para filtrar
   * los clientes que tienen WhatsApp.
   */
  const handleFileUpload = async () => {
    try {
      const formData = createFormData();

      // Realiza la subida del archivo
      const response = await uploadExcelFile('/upload/excel', formData, accessToken || "");

      // Si la subida es exitosa, muestra un mensaje de éxito
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

  /**
   * Maneja la acción de filtrar los datos.
   * Si el usuario no está logueado, abre el modal para mostrar el código QR.
   * Si está logueado, procede a subir el archivo.
   */
  const handleFilterData = () => {
    if (!isLoggedIn) {
      setIsModalOpen(true); // Abre el modal si no está logueado
    } else {
      handleFileUpload(); // Procesa el archivo si está logueado
    }
  };

  return (
    <Flex height="14rem"
      p={6}
      border="1px"
      borderColor="gray.300"
      rounded="lg"
      shadow="md"
      flexDirection="row"
      alignItems="center"
      justifyContent={"space-around"}
      mb={6}>
      <Text fontSize="lg" color="gray.700" width={'70%'}>
        Se va a filtrar el archivo proporcionado para separar aquellos clientes que tengan WhatsApp de los que no.
      </Text>
      <Button onClick={handleFilterData} isDisabled={isButtonDisabled} colorScheme="green">
        Filtrar Datos
      </Button>

      {/* Modal para mostrar el código QR */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent boxSize={500}>
          <ModalHeader>Escanea el código QR para iniciar sesión en WhatsApp</ModalHeader>
          <ModalBody>
            {isLoadingQr ? (
              <Text>Cargando código QR...</Text>
            ) : qrCode ? (
              <Image src={qrCode} alt="Código QR" />
            ) : (
              <Text>No se pudo obtener el código QR.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={() => setIsModalOpen(false)}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default FilterComponent;
