import { useContext, useEffect, useState } from "react";
import { Chat } from "../../types/types";
import { getChatbyId } from "../../service/apiService";
import { SocketContext, SocketContextProps } from "../../contexts/SocketContext";

export default function Notifications () {

  const [notifications, setNotifications] = useState<Chat | null>(null);

  const { userId } = useContext<SocketContextProps>(SocketContext)

  useEffect(() => {
    getChatbyId(userId)
      .then((notifications) => setNotifications(notifications))
      .catch((error) => console.log(error));
  }, [])

  return (<>
    {notifications && (
      <div className="notifications">
        {notifications.messages.map((notification, index) => (
          <div className="notification-item">{notification.body}</div>
        ))}
      </div>
    )}
  </>)
}