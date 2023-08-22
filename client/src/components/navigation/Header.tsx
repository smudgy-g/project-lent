import { useContext } from "react";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import DropdownButton from "./DropdownButton";
import { useNavigate } from "react-router-dom";
import { ActionButtonData } from "../../types/types";

export default function Header () {

  const { currentPage, actionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const navigate = useNavigate();

  /* Event handler */

  // When the user clicks the "back" button
  function handleClickBack () {
    navigate(-1);
  }

  /* Render Component */

  return (<>
    <div className="header">
      <button className="button plain back" onClick={handleClickBack}></button>
      <h1 className="small">{currentPage}</h1>
      <div className="action-button-group">
        {actionButtonGroupData.map((item: (ActionButtonData | ActionButtonData[]), index: number) => {
          // If the item is an array of action button objects
          if (Array.isArray(item)) {
            return <DropdownButton key={index} actionButtonDataArray={item} />;
          }
          // If the item is a action button object
          return <button key={index} className={`button action ${item.type}`} onClick={item.action}>{item.title}</button>
        })}
      </div>
    </div>
  </>);
}