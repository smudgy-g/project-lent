/* Imports */

import { useContext, useEffect, useState } from "react";
import { ActionButtonData, HeaderContext, HeaderContextProps } from "../contexts/HeaderContext";

/* Component Definition */

export default function Header () {

  const [previousPageName, setPreviousPageName] = useState<string | undefined>(undefined);
  const { actionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);

  /* Use Effect */

  // When the location changes, transform the path name to the page name,
  // and update the previousPagePath
  useEffect(() => {
    const previousPageName = lookUpPageNameFromPathName(window.location.pathname);
    setPreviousPageName(previousPageName);
  }, [window.location.pathname]);

  /* Render Component */

  return (<>
    <div className="header">
      {previousPageName &&
        <button className="button plain back">{previousPageName}</button>
      }
      <div className="action-button-group">
        {actionButtonGroupData.map((item: (ActionButtonData | ActionButtonData[]), index: number) => {
          // If the item is an array of action button objects
          if (Array.isArray(item)) {
            return (<>
              <button key={index} className="button action multi">…</button>
              <div key={`${index}-list`} className="button-list">
                {item.map((item: ActionButtonData, index: number) => <button key={index} className="button" onClick={item.action}>{item.title}</button>)}
              </div>
            </>);
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
  const pathArray = pathname.split('/');
  if (pathArray.length < 1) return undefined;
  if (pathArray.length === 1) return pathname.slice(0, 1).toUpperCase() + pathname.slice(1);
  else return pathArray[1];
}