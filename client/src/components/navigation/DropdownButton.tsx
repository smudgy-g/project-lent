import { useState } from "react";
import { ActionButtonData } from "../../types/types";

interface DropdownButtonProps {
  actionButtonDataArray: ActionButtonData[];
}

export default function DropdownButton ({ actionButtonDataArray }: DropdownButtonProps) {

  /* State variable */

  const [isOpen, setIsOpen] = useState<boolean>(false);

  /* Handler function */

  function handleToggle () {
    setIsOpen(!isOpen);
  }

  function handleClick(action: () => void) {
    action();
    handleToggle()
  }

  /* Render Component */

  return (<>
    <div className="dropdown-group">
      <button className="button action multi" onClick={handleToggle}>…</button>
      {isOpen && <div className="button-list">
        {actionButtonDataArray.map((actionButtonData: ActionButtonData, index: number) => <button key={index} className="button" onClick={() => handleClick(actionButtonData.action)}>{actionButtonData.title}</button>)}
      </div>}
    </div>
  </>)
}