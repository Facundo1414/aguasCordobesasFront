'use client';
import '../styles/globals.css';
import HomePage from '../components/pages/HomePage';
import { Flex, Spinner } from '@chakra-ui/react';
import { useAuthProtection } from './useAuthProtection';

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
    <Flex bg="gray.100" minHeight="100vh" pt={6}>
      <HomePage />
    </Flex>
  );
}
