import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define los tipos para los archivos y sus estados
interface FileData {
  data: any[][];
  fileName: string;
  isSentOrUsed: boolean;
}

// Define los tipos para el estado y las funciones del contexto
interface GlobalContextType {
  accessToken: string | null;
  refreshToken: string | null;

  excelFileByUser: FileData;
  noWhatsappClients: FileData;
  pa01PlanClients: FileData;
  otherPlansClients: FileData;

  setExcelFileByUser: (data: FileData) => void;
  setNoWhatsappClients: (data: FileData) => void;
  setPa01PlanClients: (data: FileData) => void;
  setOtherPlansClients: (data: FileData) => void;

  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
}

// Crea el contexto
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [excelFileByUser, setExcelFileByUser] = useState<FileData>({ data: [], fileName: '', isSentOrUsed: false });
  const [noWhatsappClients, setNoWhatsappClients] = useState<FileData>({ data: [], fileName: '', isSentOrUsed: false });
  const [pa01PlanClients, setPa01PlanClients] = useState<FileData>({ data: [], fileName: '', isSentOrUsed: false });
  const [otherPlansClients, setOtherPlansClients] = useState<FileData>({ data: [], fileName: '', isSentOrUsed: false });

  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));

  useEffect(() => {
    localStorage.setItem('accessToken', accessToken ?? '');
    localStorage.setItem('refreshToken', refreshToken ?? '');
  }, [accessToken, refreshToken]);

  return (
    <GlobalContext.Provider
      value={{
        accessToken,
        refreshToken,
        excelFileByUser,
        setExcelFileByUser,
        noWhatsappClients,
        setNoWhatsappClients,
        pa01PlanClients,
        setPa01PlanClients,
        otherPlansClients,
        setOtherPlansClients,
        setAccessToken,
        setRefreshToken,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Hook personalizado
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext debe usarse dentro de un GlobalProvider');
  }
  return context;
};
