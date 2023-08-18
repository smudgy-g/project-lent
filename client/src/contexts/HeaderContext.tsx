import { ReactNode, createContext, useState } from "react";

/* Header Context */

// Type definitions

export type ActionButtonData = {
  type?: string;
  title: string;
  action: () => void;
};

export type ActionButtonGroupData = (ActionButtonData | ActionButtonData[])[];

export interface HeaderContextProps {
  actionButtonGroupData: ActionButtonGroupData;
  setActionButtonGroupData: React.Dispatch<React.SetStateAction<ActionButtonGroupData>>;
};

// Create header context
export const HeaderContext = createContext<HeaderContextProps>({actionButtonGroupData: [], setActionButtonGroupData: () => {}});

/* Header Provider */

// Type definition
interface HeaderProviderProps {
  children: ReactNode;
};

// Component definition
export default function HeaderProvider ({ children }: HeaderProviderProps) {

  /* State Variable */

  const [actionButtonGroupData, setActionButtonGroupData] = useState<ActionButtonGroupData>([]);

  /* Constant Definition */

  const values: HeaderContextProps = {
    actionButtonGroupData,
    setActionButtonGroupData
  };

  /* Render Component */

  return (
    <HeaderContext.Provider value={values}>
      {children}
    </HeaderContext.Provider>
  );
};