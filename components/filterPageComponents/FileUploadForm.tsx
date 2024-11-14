import React from 'react';
import { Button, Flex, Text, useToast } from '@chakra-ui/react';
import { FileUploader } from 'react-drag-drop-files';
import { fileTypes } from '../extra/typesSendFilterProcessPage';

interface FileUploadFormProps {
  onFileChange: (file: File) => void;
  onFilterClick: () => void;  // Cambiado para iniciar el filtrado
  onCancel: () => void;
  file: File | null;
}

const FileUploadForm: React.FC<FileUploadFormProps> = ({ onFileChange, onFilterClick, onCancel, file }) => {
  const toast = useToast();

  const handleFileChange = (file: File) => {
    onFileChange(file);
    toast({
      title: 'Archivo cargado con éxito.',
      description: 'Puedes proceder a filtrarlo.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex
      height="14rem"
      p={6}
      border="1px"
      borderColor="gray.300"
      rounded="lg"
      shadow="md"
      flexDirection="column"
      alignItems="center"
      mb={6}
      width={"40%"}
    >
      <Flex height="20%" width="100%" justifyContent="center" alignItems="center">
        {file ? (
          <Text color="green.400" fontWeight={600} fontSize={22}>
            {file.name}
          </Text>
        ) : (
          <Text color="gray.500" fontWeight={600} fontSize={22}>
            Ingrese el archivo
          </Text>
        )}
      </Flex>
      <Flex height="60%" width="100%" justifyContent="center" alignItems="center">
        <FileUploader handleChange={handleFileChange} name="file" types={fileTypes} alignSelf="center" />
      </Flex>
      <Flex height="20%" width="100%" padding={6} justifyContent="space-between" alignItems="center">
        <Button onClick={onCancel} bg="red.500" color="white" rounded="lg" _hover={{ bg: "red.600" }} minWidth="120px">
          Cancelar
        </Button>
        <Button onClick={onFilterClick} bg="green.300" color="white" rounded="lg" _hover={{ bg: "green.600" }} minWidth="120px">
          Siguiente Paso
        </Button>
      </Flex>
    </Flex>
  );
};

export default FileUploadForm;
