// QrCodeDisplay.tsx
import React from 'react';
import { Image, Spinner, Text } from '@chakra-ui/react';

interface QrCodeDisplayProps {
  qrCode: string | null;
  isLoadingQr: boolean;
}

const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({ qrCode, isLoadingQr }) => {
  return (
    <>
      {isLoadingQr ? (
        <Spinner />
      ) : (
        <>
          {qrCode ? (
            <Image src={qrCode} alt="Código QR" />
          ) : (
            <Text>Debes escanear el código QR.</Text>
          )}
        </>
      )}
    </>
  );
};

export default QrCodeDisplay;
