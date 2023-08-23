import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Notifications from "./Notifications";
import { SocketContext, SocketContextProps } from "../../contexts/SocketContext";

export default function TabNavigation () {

  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const {
    unreadCount
  } = useContext<SocketContextProps>(SocketContext);

  /* Event Handler */

  function handleClickNotifications () {
    setShowNotifications(!showNotifications);
  }

  function handleClickTabNavigation () {
    if (showNotifications) {
      handleClickNotifications();
    }
  }

  return (<>
    <div className="tab-navigation">
      <Link to={'/collections'}>
        <button className="button collections" onClick={handleClickTabNavigation}>Collections</button>
      </Link>

      <Link to={'/discover'}>
        <button className="button discover" onClick={handleClickTabNavigation}>Discover</button>
      </Link>

      <Link to={'/item/add'}>
        <button className="button add item" onClick={handleClickTabNavigation}>Add Item</button>
      </Link>

      <Link to={'/inbox'} className={`unread-element ${(unreadCount && unreadCount > 0) && 'unread'}`}>
        <button className="button messages" onClick={handleClickTabNavigation}>Messages</button>
      </Link>

      <button className="button notifications" onClick={handleClickNotifications}>Notifications</button>
      {showNotifications && <Notifications setShowNotifications={setShowNotifications} />}
    </div>
  </>)
}