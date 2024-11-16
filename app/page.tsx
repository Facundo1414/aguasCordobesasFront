'use client';
import '../styles/globals.css';
import HomePage from '../components/pages/HomePage';
import { Flex, Spinner } from '@chakra-ui/react';
import { useAuthProtection } from './useAuthProtection';
import FooterComponent from '@/components/homeComponents/FooterComponent';

export default function Page() {
  const isLoading = useAuthProtection();

  if (isLoading) {
    return (
      <Flex
        bg="gray.100"
        minHeight="100vh"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Flex bg="gray.100" minHeight="100vh" pt={6} direction={"column"}>
      <Flex direction="column" flex="1">
        <HomePage />
      </Flex>
      <FooterComponent />
    </Flex>
  );
}
