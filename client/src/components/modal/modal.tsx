import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ActionButtonData } from "../../types/types";
import { ModalContext, ModalContextProps, ModalData } from "../../contexts/ModalContext";

export default function Modal () {

  const { modalData, setModalData } = useContext<ModalContextProps>(ModalContext);

useEffect(() => {
  const localModalData: ModalData = {
    title: 'Cancel Reservation Confirmation',
    text: 'Are you sure you want to cancel this reservation?',
    actionText: 'Cancel Reservation',
    action: async () => console.log('hello')
  };
  setModalData(localModalData);
}, []);

  /* Event handler */

  /* Render Component */

  return (<>
    <div className="modal-wrapper">
      <div className="modal">
        <div>{modalData.title}</div>
        <div>{modalData.text}</div>
        <button onClick={modalData.action}>{modalData.actionText}</button>
      </div>
    </div>
  </>);
}