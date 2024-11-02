import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ExcelRow {
  unidad: string | null;
  tel_uni: string | null;
  tel_clien: string | null;
  tipo_plan: string | null;
  plan_num: string | null;
  cod_mot_gen: string | null;
  criterios: string | null;
  contrato: string | null;
  entrega: string | null;
  situ_actual: string | null;
  situ_uni: string | null;
  cant_venci: string | null;
  cant_cuot: string | null;
  cliente_01: string | null;
  ejecutivoCta: string | null;
}

// Define el contexto
interface GlobalContextType {
  excelFileByUser: { data: ExcelRow[]; fileName: string; isSentOrUsed: boolean } | null;
  setExcelFileByUser: (file: { data: ExcelRow[]; fileName: string; isSentOrUsed: boolean }) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [excelFileByUser, setExcelFileByUserState] = useState<{ data: ExcelRow[]; fileName: string; isSentOrUsed: boolean } | null>(null);

  const setExcelFileByUser = (file: { data: ExcelRow[]; fileName: string; isSentOrUsed: boolean }) => {
    setExcelFileByUserState(file);
  };

  return (
    <GlobalContext.Provider value={{ excelFileByUser, setExcelFileByUser }}>
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
