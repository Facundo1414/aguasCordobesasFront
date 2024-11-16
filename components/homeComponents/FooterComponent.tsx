import { PhoneIcon } from "@chakra-ui/icons"
import { Box, IconButton, Text } from "@chakra-ui/react"
import Link from "next/link"

export default function FooterComponent() {
    
    return (

    <Box
        bg="blue.900"
        color="white"
        p={4}
        mt={8}
        textAlign="center"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexDirection={["column", "row"]}
        width="100%"
      >
        <Box mb={[4, 0]}>
          <Text>&copy; 2024 AQUA. Todos los derechos reservados.</Text>
        </Box>

        <Box>
          <Link
            href="https://wa.me/3513479404" // Enlace para abrir WhatsApp con el número especificado
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton
              icon={<PhoneIcon/>}
              aria-label="Contactar soporte por WhatsApp"
              colorScheme="teal"
            />
          </Link>
        </Box>

        <Box mb={[4, 0]}>
          <Text fontSize="sm" color="gray.300">
            Términos y condiciones | Política de privacidad
          </Text>
        </Box>
      </Box>
    )
}