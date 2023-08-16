import { useContext, useEffect, useState } from "react";
import { ActionButtonData, HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import DropdownButton from "./DropdownButton";
import { useNavigate } from "react-router-dom";

/* Component Definition */

export default function Header () {

  /* State Variable */

  const [previousPageName, setPreviousPageName] = useState<string | undefined>(undefined);

  /* Hooks */

  const { actionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const navigate = useNavigate();

  /* Use Effect */

  // When the location changes, transform the path name to the page name,
  // and update the previousPagePath
  useEffect(() => {
    const previousPageName = lookUpPageNameFromPathName(window.location.pathname);
    setPreviousPageName(previousPageName);
  }, [window.location.pathname]);

  /* Event handler */

  // When the user clicks the "back" button
  function handleClickBack () {
    navigate(-1);
  }

  /* Render Component */

  return (<>
    <div className="header">
      {previousPageName &&
        <button className="button plain back" onClick={handleClickBack}>{previousPageName}</button>
      }
      {!previousPageName && <div></div>}
      <div className="action-button-group">
        {actionButtonGroupData.map((item: (ActionButtonData | ActionButtonData[]), index: number) => {
          // If the item is an array of action button objects
          if (Array.isArray(item)) {
            return <DropdownButton key={index} actionButtonDataArray={item} />;
          }
          // If the item is a action button object
          return <button key={index} className="button action" onClick={item.action}>{item.title}</button>
        })}
      </div>
    </div>
  </>);
}

/* Helper Function */

function lookUpPageNameFromPathName (pathname: string) {
  const pathArray = pathname.slice(1).split('/');

  if (pathArray.length < 1) return undefined;
  if (pathname === '/' || pathname === '/register' || pathname === '/login' || pathname === '/profile' || pathname === '/collections' || pathname === '/inbox') return '';
  else if (pathArray.length > 1) return pathArray[0].slice(0, 1).toUpperCase() + pathArray[0].slice(1);
}