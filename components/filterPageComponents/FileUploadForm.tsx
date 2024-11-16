import React from 'react';
import { Button, Flex, Text, useToast } from '@chakra-ui/react';
import { FileUploader } from 'react-drag-drop-files';
import { fileTypes } from '../extra/typesSendFilterProcessPage';
import { motion } from 'framer-motion';

interface FileUploadFormProps {
  onFileChange: (file: File) => void;
  onFilterClick: () => void;  // Cambiado para iniciar el filtrado
  onCancel: () => void;
  file: File | null;
}

const FileUploadForm: React.FC<FileUploadFormProps> = ({ onFileChange, onFilterClick, onCancel, file }) => {
  const toast = useToast();

  const handleFileChange = (file: File) => {
    const onChange = onFileChange(file);
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
          <Text color="black.500" fontWeight={600} fontSize={22}>
            Ingrese el archivo
          </Text>
        )}
      </Flex>

      <Flex height="60%" width="100%" justifyContent="center" alignItems="center">
        <motion.div
        animate={{
          scale: [1, 1.05, 1], 
          opacity: [0.8, 1, 0.8], 
        }}
        transition={{
          duration: 1.5,
          repeat: 3, 
          repeatType: 'loop', 
        }}
      >
        <Flex height="60%" width="100%" justifyContent="center" alignItems="center">
          <FileUploader handleChange={handleFileChange} name="file" types={fileTypes} alignSelf="center" />
        </Flex>
      </motion.div>      
    </Flex>

      <Flex height="20%" width="100%" padding={6} justifyContent="space-between" alignItems="center">
        <Button onClick={onCancel} bg="gray.600" color="white" rounded="lg" _hover={{ bg: "red.400" }} minWidth="120px">
          Cancelar
        </Button>
        <Button onClick={onFilterClick} bg="blue.500" color="white" rounded="lg" _hover={{ bg: "blue.300" }} minWidth="120px">
          Siguiente Paso
        </Button>
      </Flex>
    </Flex>
  );
};

export default FileUploadForm;
