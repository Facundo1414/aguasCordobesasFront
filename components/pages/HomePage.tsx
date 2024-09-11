import React from 'react';
import { Box, Grid, GridItem, Heading, Text, Image, Flex, Link } from '@chakra-ui/react';
import { InfoIcon, PhoneIcon, SettingsIcon, StarIcon, TimeIcon } from '@chakra-ui/icons';

export default function HomePage() {
  return (
    <Box py={8} px={[4, 8, 20]} bg="gray.100">
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        {/* Encabezado con logo y texto */}
        <GridItem colSpan={12}>
          <Flex borderRadius="lg" bg="white" shadow="lg">
            <Flex width={"30%"} justifyContent="center" alignItems="center" p={4} overflow={"hidden"}>
              <Flex width={"40%"} flexDirection={"column"} justifyContent="center" >
                <Heading as="h2">AQUA</Heading>
                <Text fontWeight="normal" fontSize={"1.2rem"} color="gray.600">
                  Al servicio de Cclip.
                </Text>
              </Flex>
              <Image width={"60%"} src="/logoWater.png" alt="Logo" boxSize={"12rem"} maxBlockSize={"15rem"} />
            </Flex>
            <Flex
              width={"70%"}
              justifyContent="center"
              alignItems="center"
              bgImage="url('/bg_topEspacioClientes.jpg')"
              bgSize="cover"
              borderRadius="lg"
              p={6}
            >
              <Text fontSize={["lg", "xx-large"]} maxW="60%" textAlign="right" color="white">
                Bienvenido a nuestra página. Aquí podrás encontrar servicios personalizados para la gestión de clientes.
              </Text>
            </Flex>
          </Flex>
        </GridItem>

        {/* Grid de servicios */}
        <GridItem colSpan={12}>
          <Flex mt={8} justifyContent="center" alignItems="center" textAlign="center" direction="column">
            <Text fontSize="3xl" fontWeight="bold" color="gray.800" mb={2}>
              Nuestros Servicios
            </Text>
            <Text fontSize="md" color="gray.500" maxW="70%">
              Descubre los servicios que ofrecemos para ayudarte en la gestión y optimización de tus clientes.
            </Text>
            <Box mt={4} w="60px" h="4px" bg="blue.300" borderRadius="full" />
          </Flex>
          <Grid templateColumns="repeat(3, 1fr)" gap={4} mt={8}>
            {/* Primera fila: 3 Cards */}
            <GridItem colSpan={1}>
              <Link href="/servicio1">
                <Box p={4} bg="teal.400" borderRadius="md" display="flex" w={"100%"} h={"6rem"} alignItems="center" as="button">
                  <InfoIcon w={8} h={8} color="white" />
                  <Text ml={4} fontSize="lg" color="white">
                    Enviar deudas a clientes por Whats App
                  </Text>
                </Box>
              </Link>
            </GridItem>
            <GridItem colSpan={1}>
              <Link href="/servicio2">
                <Box p={4} bg="purple.400" borderRadius="md" display="flex" w={"100%"} h={"6rem"} alignItems="center" as="button">
                  <SettingsIcon w={8} h={8} color="white" />
                  <Text ml={4} fontSize="lg" color="white">
                    Servicio 2
                  </Text>
                </Box>
              </Link>
            </GridItem>
            <GridItem colSpan={1}>
              <Link href="/servicio3">
                <Box p={4} bg="orange.400" borderRadius="md" display="flex" w={"100%"} h={"6rem"} alignItems="center" as="button">
                  <TimeIcon w={8} h={8} color="white" />
                  <Text ml={4} fontSize="lg" color="white">
                    Servicio 3
                  </Text>
                </Box>
              </Link>
            </GridItem>

            {/* Segunda fila: 2 Cards */}
            <GridItem colSpan={1}>
              <Link href="/servicio4">
                <Box p={4} bg="green.400" borderRadius="md" display="flex" w={"100%"} h={"6rem"} alignItems="center" as="button">
                  <PhoneIcon w={8} h={8} color="white" />
                  <Text ml={4} fontSize="lg" color="white">
                    Servicio 4
                  </Text>
                </Box>
              </Link>
            </GridItem>
            <GridItem colSpan={2}>
              <Link href="/servicio5">
                <Box p={4} bg="blue.400" borderRadius="md" display="flex" w={"100%"}h={"6rem"} alignItems="center" as="button">
                  <StarIcon w={8} h={8} color="white" />
                  <Text ml={4} fontSize="lg" color="white">
                    Servicio 5
                  </Text>
                </Box>
              </Link>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </Box>
  );
}
