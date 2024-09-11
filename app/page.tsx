// app/page.tsx
'use client';
import '../styles/globals.css';
import HomePage from '../components/pages/HomePage';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Center, Spinner } from '@chakra-ui/react';


export default function Page() {
  const { isLoading } = useUser();

  return (
    <>
      {isLoading? (
        <Center height="100vh">
          <Spinner size="xl" />
        </Center>
      ): (
        <HomePage />
      )}
    </>
  );
}
