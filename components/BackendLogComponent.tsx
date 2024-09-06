import { Box, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'

const BackendLogComponent = () => {
    const [logs, setLogs] = useState<string[]>([]);
  
    // Simula la actualización de los logs cada 2 segundos
    React.useEffect(() => {
      const interval = setInterval(() => {
        const newLog = `Backend status at ${new Date().toLocaleTimeString()}`;
        setLogs((prevLogs) => [...prevLogs, newLog]);
      }, 2000);
  
      return () => clearInterval(interval);
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
        <VStack align="start" spacing={1}>
          {logs.map((log, index) => (
            <Text key={index} fontSize="sm">
              {log}
            </Text>
          ))}
        </VStack>
      </Box>
    );
  };
export default BackendLogComponent