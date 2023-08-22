import { useState } from "react";
import { Link } from "react-router-dom";
import Notifications from "./Notifications";

export default function TabNavigation () {

  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  /* Event Handler */

  function handleClickNotifications () {
    setShowNotifications(!showNotifications);
  }

  return (<>
    <div className="tab-navigation">
      <Link to={'/collections'}><button className="button collections">Collections</button></Link>
      <Link to={'/discover'}><button className="button discover">Discover</button></Link>
      <Link to={'/item/add'}><button className="button add item">Add Item</button></Link>
      <Link to={'/inbox'}><button className="button messages">Messages</button></Link>
      <button className="button notifications" onClick={handleClickNotifications}>Notifications</button>
      {showNotifications && <Notifications />}
    </div>
  </>)
}