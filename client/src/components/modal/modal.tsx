import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ActionButtonData } from "../../types/types";
import { ModalContext, ModalContextProps, ModalData } from "../../contexts/ModalContext";

export default function Modal () {

  const { modalData, showModal } = useContext<ModalContextProps>(ModalContext);

  /* Event handler */

  /* Render Component */

  return (<>
    {showModal && (
    <div className="modal-wrapper">
      <div className="modal">
        <div><h1>{modalData.title}</h1></div>
        <div className="modal-text" dangerouslySetInnerHTML={{ __html: modalData.text }}></div>
        <button className="button styled large" onClick={modalData.action}>{modalData.actionText}</button>
      </div>
    </div>
    )}
  </>);
}