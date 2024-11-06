import { ExcelRow } from '@/components/extra/typesSendFilterProcessPage';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';


interface GlobalContextType {
  excelFileByUser: { data: ExcelRow[]; fileName: string; isSentOrUsed: boolean } | null;
  setExcelFileByUser: (file: { data: ExcelRow[]; fileName: string; isSentOrUsed: boolean }) => void;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  refreshToken: string | null;
  setRefreshToken: (token: string) => void;
  getToken: () => string | null;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [excelFileByUser, setExcelFileByUserState] = useState<{ data: ExcelRow[]; fileName: string; isSentOrUsed: boolean } | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);


  const setExcelFileByUser = (file: { data: ExcelRow[]; fileName: string; isSentOrUsed: boolean }) => {
    setExcelFileByUserState(file);
  };

    // Función para obtener el token del localStorage
    const getToken = (): string | null => {
      return localStorage.getItem('accessToken');
    };
  
    // Uso de useEffect para sincronizar el token con el localStorage
    useEffect(() => {
      const token = getToken();
      if (token) {
        setAccessToken(token);
      }
    }, []);


  return (
    <GlobalContext.Provider
      value={{
        excelFileByUser,
        setExcelFileByUser,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        getToken
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Hook para usar el contexto
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext debe ser usado dentro de un GlobalProvider');
  }
  return context;
};
