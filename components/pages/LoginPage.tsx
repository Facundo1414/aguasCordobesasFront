import { useState } from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Stack, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { userLogin, getIsLoggedIn, initializeWhatsAppSession } from '@/app/services/apiService';
import { useGlobalContext } from '@/app/providers/GlobalContext';
import Cookies from 'js-cookie';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { setAccessToken, setRefreshToken, setUsernameGlobal } = useGlobalContext();
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const loginResult = await userLogin(username, password);
  
      // Guardar los datos en el estado global/local
      setAccessToken(loginResult.accessToken);
      setRefreshToken(loginResult.refreshToken);
      setUsernameGlobal(loginResult.username); // Guardar el username
  
      localStorage.setItem('accessToken', loginResult.accessToken);
      localStorage.setItem('refreshToken', loginResult.refreshToken);
      localStorage.setItem('username', loginResult.username); // Guardar el username en localStorage
  
      Cookies.set('accessToken', loginResult.accessToken, { expires: 1 });
      Cookies.set('refreshToken', loginResult.refreshToken, { expires: 1 });
  
      initializeWhatsAppSession(loginResult.accessToken);
  
      toast({
        title: `¡Bienvenido, ${loginResult.username}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
  
      router.push("/");
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      toast({
        title: 'Nombre de usuario o contraseña incorrectos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgImg="/bg_topEspacioClientes.jpg"
      bgSize="cover"
      bgPos="center"
      position="relative"
    >
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
                disabled={isSubmitting}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full" isLoading={isSubmitting}>
              Iniciar Sesión
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};

export default LoginPage;
