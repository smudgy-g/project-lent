import { ReactNode, createContext, useState } from "react";

export type ModalData = {
  title: string,
  text: string,
  actionText: string;
  action: () => void;
};

export interface ModalContextProps {
  modalData: ModalData;
  setModalData: React.Dispatch<React.SetStateAction<ModalData>>;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  toggleModal: () => void;
};

// Create modal context
export const ModalContext = createContext<ModalContextProps>({
  modalData: {
    title: '',
    text: '',
    actionText: '',
    action: () => {},
  },
  setModalData: () => {},
  showModal: false,
  setShowModal: () => {},
  toggleModal: () => {},
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
    title: '',
    text: '',
    actionText: '',
    action: () => {},
  });
  const [showModal, setShowModal] = useState<boolean>(false);

  /* Handler Function */

  function toggleModal() {
    setShowModal(!showModal);
  }

  /* Constant Definition */

  const values: ModalContextProps = {
    modalData,
    setModalData,
    showModal,
    setShowModal,
    toggleModal
  };

  return (
    <ModalContext.Provider value={values}>
      {children}
    </ModalContext.Provider>
  );
};