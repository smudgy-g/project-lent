import { useEffect, useState } from "react";
import { Chat, User} from "../../types/types";
import { useParams } from 'react-router-dom'
import { getChatbyId } from "../../service/apiService";

function Chat() {

  /* State Variables */

  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [userId, setUserId] = useState<User['id'] | null>(null)

  /* Hooks */
  const {chatId} = useParams()

  /* Use Effect */

  useEffect(() => {
    getChatbyId(chatId)
      .then((chat) => setCurrentChat(chat))
      .catch((error) => console.log(error));
  })
  
  /* Helper Functions */

  // Helper Function to get the userId
  function getCookieValue(cookieName : string)  {
    const cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      // Check if the cookie starts with the provided name
      if (cookie.indexOf(cookieName + '=') === 0) {
        // Get the value of the cookie
        const cookieValue = cookie.substring(cookieName.length + 1);

        // Decode the cookie value
        const decodedValue = decodeURIComponent(cookieValue);

        // Return the decoded value
        return decodedValue;
      }
    }
    // Cookie not found
    return '';
  }

  function getUserId () {
    const userIdObject = getCookieValue('_auth_state');
    const parsedUserIdObject = JSON.parse(userIdObject);
    const userId = parsedUserIdObject._id;
    setUserId(userId);
  }

  getUserId();

  /* Render Component */

  return (<>
    <div className="chat">
      {currentChat?.messages.map((message) => (
        <div key={message.id}>
          {message.to !== userId ? (
            <div className="message foreign-user">
              <div className="time">
                {message.createdAt}
              </div>
              <div className="username">
                {message.foreignUsername}
              </div>
              <div className="message-body">
                {message.body}
              </div>
            </div>
          ) : (
            <div className="message user">
              <div className="time">
                {message.createdAt}
              </div>
              <div className="username">
                You:
              </div>
              <div className="message-body">
                {message.body}
              </div>
            </div>
          )
          }
        </div>
    ))}
    </div>
    
  </>);
}

export default Chat;