/* Type Definitions */

import { useContext, useEffect, useState } from "react";
import { ActionButtonData, HeaderContext, HeaderContextProps } from "../contexts/HeaderContext";

/* Component Definition */

export default function Header () {

  const [previousPageName, setPreviousPageName] = useState<string>('');
  const { actionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);

  // Update the previousPagePath whenever the location changes
  useEffect(() => {
    const previousPageName = lookUpPageNameFromPathName(window.location.pathname);
    setPreviousPageName(previousPageName);
  }, [window.location.pathname]);

  /* Render Component */

  return (<>
    <div className="header">
      <button className="button plain back">{previousPageName}</button>
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

function lookUpPageNameFromPathName (pathname: string) {
  if (pathname === 'profile' || pathname === 'collections' || pathname === 'discover' || pathname === 'inbox') {
    return pathname.slice(0, 1).toUpperCase() + pathname.slice(1);
  }
  const pathArray = pathname.split('/');
  if (pathArray.length === 2) {
    if (pathArray[0] === 'collection' || pathArray[0] === 'item') {
      return pathArray[1];
    }
  }
  return '';
}