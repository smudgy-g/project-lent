import { Link } from "react-router-dom";
import { Chat } from "../../types/types";

interface NotificationsProps {
  notifications: Chat | null;
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  setNotificationCount: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function Notifications ({ notifications, setShowNotifications, setNotificationCount }: NotificationsProps) {

  /* Event handler */

  function handleClickOverlay () {
    setShowNotifications(false);
  }

  return (<>
    {notifications && (<>
      <div className="notifications-overlay" onClick={handleClickOverlay}></div>
      <div className="notifications-list">
        {!notifications.messages.some((notification) => !notification.notification?.seen) && (
          <div className="notification-item" onClick={handleClickOverlay}>
            <div className="body">No new notifications</div>
            <button className="button arrow-right-circle">To Item</button>
          </div>
        )}
        {notifications.messages.some((notification) => !notification.notification?.seen) && (<>
          {notifications.messages && notifications.messages
            .filter((notification) => !notification.notification?.seen)
            .map((notification, index) => (
              <Link to={`/item/${notification.notification?.item}`} className="notification-item" key={index} onClick={handleClickOverlay}>
                <div className="body">{notification.body}</div>
                <button className="button arrow-right-circle">To Item</button>
              </Link>
          ))}
        </>)}
      </div>
    </>)}
  </>)
}