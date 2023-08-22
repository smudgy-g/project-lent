import { ReactNode, createContext, useState } from "react";
import { ActionButtonGroupData } from "../types/types";

/* Header Context */

export interface HeaderContextProps {
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  actionButtonGroupData: ActionButtonGroupData;
  setActionButtonGroupData: React.Dispatch<React.SetStateAction<ActionButtonGroupData>>;
};

export const HeaderContext = createContext<HeaderContextProps>({
  currentPage: '',
  setCurrentPage: () => {},
  actionButtonGroupData: [],
  setActionButtonGroupData: () => {},
});

/* Header Provider */

interface HeaderProviderProps {
  children: ReactNode;
};

export default function HeaderProvider ({ children }: HeaderProviderProps) {
  const [currentPage, setCurrentPage] = useState<string>('');
  const [actionButtonGroupData, setActionButtonGroupData] = useState<ActionButtonGroupData>([]);

  const values: HeaderContextProps = {
    currentPage,
    setCurrentPage,
    actionButtonGroupData,
    setActionButtonGroupData,
  };

  /* Render Component */

  return (
    <HeaderContext.Provider value={values}>
      {children}
    </HeaderContext.Provider>
  );
};