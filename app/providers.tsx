// app/providers.tsx
'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { GlobalProvider } from './providers/GlobalContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GlobalProvider>
      <CacheProvider>
        <ChakraProvider>{children}</ChakraProvider>
      </CacheProvider>
    </GlobalProvider>
  );
}