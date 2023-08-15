import { useEffect, useState } from "react";
import { Chat, User} from "../../types/types";
import { useParams } from 'react-router-dom'
import { getChatbyId } from "../../service/apiService";

export default function ChatSingle() {

  /* State Variables */

  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [userId, setUserId] = useState<User['id'] | null>(null)

  /* Hooks */
  const {chatId} = useParams()
  
  /* Helper Functions */

  // Helper Functions to retrieve the userId by the cookie
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

  // Helper Function to parse and set the userId
  function getUserId () {
    const userIdObject = getCookieValue('_auth_state');
    const parsedUserIdObject = JSON.parse(userIdObject);
    const userId = parsedUserIdObject._id;
    setUserId(userId);
  }
  
  /* Use Effect */

  useEffect(() => {
    getChatbyId(chatId)
      .then((result) => setCurrentChat(result))
      .catch((error) => console.log(error));
  }, [])

  useEffect(() => (
    getUserId()
  ))

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