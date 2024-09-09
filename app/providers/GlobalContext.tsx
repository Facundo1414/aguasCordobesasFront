import { createContext, useContext, useState, ReactNode } from 'react';

// Define los tipos para los archivos y sus estados
interface FileData {
  data: any[][]; // El contenido del archivo
  fileName: string; // El nombre del archivo
  isSentOrUsed: boolean; // Estado que indica si el archivo fue enviado o usado
}

// Define los tipos para el estado y las funciones del contexto
interface GlobalContextType {
  // Archivos
  excelFileByUser: FileData;
  noWhatsappClients: FileData;
  pa01PlanClients: FileData;
  otherPlansClients: FileData;

  // Funciones para actualizar los archivos
  setExcelFileByUser: (data: FileData) => void;
  setNoWhatsappClients: (data: FileData) => void;
  setPa01PlanClients: (data: FileData) => void;
  setOtherPlansClients: (data: FileData) => void;
}

// Crea el contexto con el tipo adecuado
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Define las props para el GlobalProvider
interface GlobalProviderProps {
  children: ReactNode; // Especificar que children es de tipo ReactNode
}

// Crea el proveedor del contexto
export const GlobalProvider = ({ children }: GlobalProviderProps) => {

  // Estados para los archivos
  const [excelFileByUser, setExcelFileByUser] = useState<FileData>({
    data: [],
    fileName: '',
    isSentOrUsed: false,
  });

  const [noWhatsappClients, setNoWhatsappClients] = useState<FileData>({
    data: [],
    fileName: '',
    isSentOrUsed: false,
  });

  const [pa01PlanClients, setPa01PlanClients] = useState<FileData>({
    data: [],
    fileName: '',
    isSentOrUsed: false,
  });

  const [otherPlansClients, setOtherPlansClients] = useState<FileData>({
    data: [],
    fileName: '',
    isSentOrUsed: false,
  });

  // Funciones de autenticación


  return (
    <GlobalContext.Provider
      value={{
        // Archivos y setters
        excelFileByUser,
        setExcelFileByUser,
        noWhatsappClients,
        setNoWhatsappClients,
        pa01PlanClients,
        setPa01PlanClients,
        otherPlansClients,
        setOtherPlansClients,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Hook personalizado para usar el contexto con TypeScript
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext debe usarse dentro de un GlobalProvider');
  }
  return context;
};
