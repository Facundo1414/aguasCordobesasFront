import { useState } from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Stack, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { userLogin } from '@/app/services/apiService';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const loginResult = await userLogin(username, password);
      
      toast({
        title: 'Inicio de sesión exitoso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Redirige al usuario al dashboard o a la página de inicio
      router.push('/');
    } catch (error) {
      toast({
        title: 'Nombre de usuario o contraseña incorrectos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgImg={"/bg_topEspacioClientes.jpg"}
      bgSize="cover"
      bgPos="center"
      position="relative"
    >
      {/* Superposición oscura para opacidad */}
      <Box position="absolute" top="0" left="0" right="0" bottom="0" bg="black" opacity="0.5" zIndex="1" />

      <Box zIndex="2" maxW="lg" w="full" p={8} bg="white" boxShadow="lg" rounded="lg">
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
      </Box>
    </Flex>
  );
};

export default LoginPage;
