import { ReactNode, createContext, useState } from "react";

export type ModalData = {
  title: string,
  text: string,
  action: () => void;
};

export interface ModalContextProps {
  modalData: ModalData;
  setModalData: React.Dispatch<React.SetStateAction<ModalData>>;
};

// Create modal context
export const ModalContext = createContext<ModalContextProps>({
  modalData: {
    title: "",
    text: "",
    action: () => {},
  },
  setModalData: () => {},
});

/* Header Provider */

// Type definition
interface ModalProviderProps {
  children: ReactNode;
};

// Component definition
export default function ModalProvider ({ children }: ModalProviderProps) {

  /* State Variable */

  const [modalData, setModalData] = useState<ModalData>({
    title: "",
    text: "",
    action: () => {},
  });

  /* Constant Definition */

  const values: ModalContextProps = {
    modalData,
    setModalData
  };

  return (
    <ModalContext.Provider value={values}>
      {children}
    </ModalContext.Provider>
  );
};