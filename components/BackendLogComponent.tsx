import { baseURLAPI } from '@/services/apiService';
import { Box, Text, VStack, Spinner } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const BackendLogComponent = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io(baseURLAPI);

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('log', (message: string) => {
      setLogs((prevLogs) => [...prevLogs, message]);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Cleanup al desmontar el componente
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      h="30rem"
      overflowY="auto"
      bg="gray.50"
      boxShadow="md"
    >
      <Text fontWeight="bold" mb={2}>
        Backend Logs
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
