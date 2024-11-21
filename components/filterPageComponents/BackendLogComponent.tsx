import { useGlobalContext } from '@/app/providers/GlobalContext';
import { Box, Text, VStack, Spinner } from '@chakra-ui/react';
import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

const BackendLogComponent = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { accessToken } = useGlobalContext();
  const getToken = useCallback(() => accessToken || localStorage.getItem('accessToken') || '', [accessToken]);
  

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL ?? "", {
      extraHeaders: {
        Authorization: `Bearer ${getToken()}`,
      },
      reconnectionAttempts: 5,  // Número de intentos antes de dar por fallida la reconexión
      reconnectionDelay: 1000,  // Tiempo entre reconexiones (en ms)
      reconnectionDelayMax: 5000, // Retardo máximo para reconectar
    });
  
    socket.on('connect', () => {
      setIsConnected(true);
      const userId = getToken();
      socket.emit('connectUser', userId);
    });

    socket.on('connect_error', (error) => {
      console.error('Error al conectar:', error);
    });
  
    socket.on('log', (message: string) => {
      console.log('Recibiendo log:', message);
      setLogs((prevLogs) => [...prevLogs, message]);
    });
  
    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Desconectado del servidor');
    });
  
    // Intentar reconectar
    socket.on('reconnect', () => {
      console.log('Reconectado al servidor');
    });
  
    socket.on('reconnect_error', (error) => {
      console.error('Error en la reconexión:', error);
    });
  
    return () => {
      socket.disconnect();
    };
  }, [getToken]);
  

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      h="30rem"
      bg="gray.50"
      boxShadow="md"
      overflowY="scroll"
    >
      <Text fontWeight="bold" mb={2}>
        Informacion del Servidor
      </Text>
      {isConnected ? (
        logs.length > 0 ? (
          <VStack align="start" spacing={1}>
            {logs.map((log, index) => (
              <Text key={index} fontSize="sm">
                {log}
              </Text>
            ))}
          </VStack>
        ) : (
          <Text color="green.500" fontSize="sm">
            Esperando información del servidor...
          </Text>
        )
      ) : (
        <VStack align="center">
          <Spinner size="md" color="blue.500" />
          <Text mt={2} color="red.500" fontSize="sm">
            Desconectado del servidor, intentando reconectar...
          </Text>
        </VStack>
      )}
    </Box>
  );
};

export default BackendLogComponent;
