import { ReactNode, createContext, useState, useEffect } from "react";
import { getUser, putUser } from "../service/apiService";

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
});

/* Header Provider */

// Type definition
interface ModalProviderProps {
  children: ReactNode;
};

// Component definition
export default function ModalProvider ({ children }: ModalProviderProps) {

  /* State Variable */
  // const [firstLogin, setFirstLogin] = useState<boolean>()
  const [modalData, setModalData] = useState<ModalData>({
    title: '',
    text: '',
    actionText: '',
    action: () => {},
  });
  const [showModal, setShowModal] = useState<boolean>(false);

  /* Hooks */


  /* Use Effects */
  useEffect(() => {
    getUser()
      .then((user) => {
        if(user) {
          if (user.newUser) setShowModal(true)
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const localModalData: ModalData = {
      title: 'The Lending Cycle',
      text: `
      <div class="paragraph">
        <h3>Step 1: Add an Item</h3>
        <p>Click a photo or upload an image of the item you want to lend. Give it a lending value in credits. As a thank you for adding a new item, we'll top up your account with 100 credits!</p>
      </div>
      <div class="paragraph">
        <h3>Step 2: Discover and Reserve</h3>
        <p>Explore items on our discover page or use the search bar to find something specific. Once you've found something you need, reserve it. You'll be directed to a chat with the owner to arrange the pickup.</p>
      </div>
      <div class="paragraph">
        <h3>Step 3: Receive and Transfer</h3>
        <p>Meet the owner, get your item, and confirm receipt in the app. This will trigger the transfer of the agreed credits to the owner's account.</p>
      </div>
      <div class="paragraph">
        <h3>Step 4: Return and Wrap Up</h3>
        <p>When it's time to return the item, chat with the owner to arrange the meetup. Once the item is back with the owner and they confirm it in the app, the lending cycle concludes, and the item becomes available for lending again.
        </p>
        </div>
        <div class="paragraph">
        <h3>Step 5: Be nice!</h3>
        <p>Remember, our platform thrives on trust and community. Please respect the items and the people you interact with. Happy sharing!</p>
      </div>
    `,
      actionText: 'Got it!',
      action: () => {
        putUser({
          newUser: false,
        }
        )
        setShowModal(false) 

      }
    };
    setModalData(localModalData);
  }, [setShowModal]);

  /* Constant Definition */

  const values: ModalContextProps = {
    modalData,
    setModalData,
    showModal,
    setShowModal
  };

  return (
    <ModalContext.Provider value={values}>
      {children}
    </ModalContext.Provider>
  );
};