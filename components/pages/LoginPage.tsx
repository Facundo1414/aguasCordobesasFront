// pages/login.tsx
import { useState } from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Link, Stack, Text, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [username, setUsername] = useState('');  // Cambiado a username
  const [password, setPassword] = useState('');
  const toast = useToast();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ejemplo de autenticación básica con nombre de usuario
    if (username === "user123" && password === "password123") {
      toast({
        title: 'Inicio de sesión exitoso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/dashboard');
    } else {
      toast({
        title: 'Nombre de usuario o contraseña incorrectos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box maxW="lg" w="full" p={8} bg="white" boxShadow="lg" rounded="lg">
        <Heading as="h2" mb={4} textAlign="center">
          Iniciar Sesión
        </Heading>
        <form onSubmit={handleLogin}>
          <Stack spacing={4}>
            <FormControl id="username" isRequired>
              <FormLabel>Nombre de Usuario</FormLabel>
              <Input
                type="text"
                placeholder="Ingresa tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full">
              Iniciar Sesión
            </Button>
          </Stack>
        </form>
        <Text textAlign="center" mt={4}>
          ¿No tienes una cuenta?{' '}
          <Link color="blue.500" href="/register">
            Regístrate
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default LoginPage;
