import { useContext, useEffect, useState } from "react";
import { Chat } from "../../types/types";
import { getChatbyId } from "../../service/apiService";
import { SocketContext, SocketContextProps } from "../../contexts/SocketContext";

interface NotificationsProps {
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Notifications ({ setShowNotifications }: NotificationsProps) {

  const [notifications, setNotifications] = useState<Chat | null>(null);

  // const { userId } = useContext<SocketContextProps>(SocketContext)

  useEffect(() => {
    // getChatbyId(userId)
    getChatbyId('notifications')
      .then((notifications) => setNotifications(notifications))
      .catch((error) => console.log(error));
  }, [])

  /* Event handler */

  function handleClickOverlay () {
    setShowNotifications(false);
  }

  return (<>
    {notifications && (<>
      <div className="notifications-overlay" onClick={handleClickOverlay}></div>
      <div className="notifications-list">
        <div className="notifications-title">
          <svg className="close" onClick={handleClickOverlay} width="32" height="32" fill="blueviolet" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.53 4.22a.75.75 0 0 1 0 1.06L8.81 12l6.72 6.72a.75.75 0 1 1-1.06 1.06l-7.25-7.25a.75.75 0 0 1 0-1.06l7.25-7.25a.75.75 0 0 1 1.06 0Z"/>
          </svg>
        </div>
        {notifications.messages.map((notification, index) => (
          <div key={index} className="notification-item">{notification.body}</div>
        ))}
      </div>
    </>)}
  </>)
}