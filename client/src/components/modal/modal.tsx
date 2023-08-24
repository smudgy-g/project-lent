import { useContext } from "react";
import { ModalContext, ModalContextProps } from "../../contexts/ModalContext";

export default function Modal () {

  const { modalData, showModal } = useContext<ModalContextProps>(ModalContext);

  /* Render Component */

  return (<>
    {showModal && (
    <div className="modal-wrapper">
      <div className="modal">
        <h1>{modalData.title}</h1>
        <div className="modal-text" dangerouslySetInnerHTML={{ __html: modalData.text }}></div>
        <button className="button styled full large" onClick={modalData.action}>{modalData.actionText}</button>
      </div>
    </div>
    )}
  </>);
}