// app/page.tsx
'use client';
import '../styles/globals.css';
import HomePage from '../components/pages/HomePage';
import { Box, Flex } from '@chakra-ui/react';


export default function Page() {
  return (
    <> 
    <Flex bg="gray.100" minHeight="100vh" pt={6}>
        <HomePage />
    </Flex>
    </>
  );
}
