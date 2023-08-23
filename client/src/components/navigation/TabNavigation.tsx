import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Notifications from "./Notifications";
import { SocketContext, SocketContextProps } from "../../contexts/SocketContext";
import { getChatbyId, putMessage } from "../../service/apiService";
import { Chat } from "../../types/types";

export default function TabNavigation () {

  const [notifications, setNotifications] = useState<Chat | null>(null);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number | null>(null);

  const {
    userId,
    unreadCount
  } = useContext<SocketContextProps>(SocketContext);

  // Get all notifications using the API service,
  // and calculate and set the notification count
  useEffect(() => {
    if (userId) {
      getChatbyId(userId)
        .then((notifications) => {
          setNotifications(notifications);
          setNotificationCount(sumUnseenNotifications(notifications));
        })
        .catch((error) => console.log(error));
    }
  }, [userId]);

  // Helper for calculating the sum of unseen notifications
  function sumUnseenNotifications (notifications: Chat) {
    return notifications.messages.reduce((acc, message) => {
      console.log(message.notification);

      return message.notification?.seen ? acc : acc + 1;
    }, 0);
  }

  useEffect(() => {
    if (showNotifications) {
      setAsSeen(notifications);
      setNotificationCount(0);
    }
  }, [showNotifications]);

  // Helper for marking every notification
  // as seen using the API service
  function setAsSeen (notifications: Chat | null) {
    if (!notifications) return;

    notifications.messages.map((message) => {
      if (message.id) {
        const updatedMessage = {
          id: message.id,
          notification: {
            seen: true,
          }
        }
        putMessage(updatedMessage)
          .catch((error) => {
            console.log(error);
          });
      }
      return message;
    });
  }

  /* Event Handlers */

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

      <div className={`unread-element ${(notificationCount && notificationCount > 0) && 'unread'}`}>
        <button className="button notifications" onClick={handleClickNotifications}>Notifications</button>
      </div>

      {showNotifications && <Notifications notifications={notifications} setShowNotifications={setShowNotifications} setNotificationCount={setNotificationCount} />}
    </div>
  </>)
}