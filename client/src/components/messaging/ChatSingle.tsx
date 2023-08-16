import { useEffect, useState, useContext } from "react";
import { Chat, User, Message, MessageToSend} from "../../types/types";
import { useParams } from 'react-router-dom'
import { getChatbyId } from "../../service/apiService";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";

export default function ChatSingle() {

  /* State Variables */

  const [inputValue, setInputValue] = useState<string>('');
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [userId, setUserId] = useState<User['id']>('');
  // const [foreignUserId, setForeignUserId] = useState<string>('')
  const [currentMessageData, setCurrentMessageData] = useState<MessageToSend | null>();

  /* Hooks */
  const {chatId} = useParams()
  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);

  /* Handler Functions */

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value)
    setCurrentMessageData(
      {
        body: inputValue,
        from: userId,
        to: currentChat?.foreignUserId,
        seen: false,
      })
  };
  
  function handleClick() {
    console.log('currentMessage', currentMessageData)
    console.log('chatID', chatId)
    setInputValue('')
    // postMessage(currentMessageData, chatId!)
  };
       
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
      };
    };
    // Cookie not found
    return '';
  };

  // Helper function to parse and set the userId
  function getUserId () {
    const userIdObject = getCookieValue('_auth_state');
    const parsedUserIdObject = JSON.parse(userIdObject);
    const userId = parsedUserIdObject._id;
    setUserId(userId);
  };


  /* Use Effect */

  useEffect(() => {
    setActionButtonGroupData([]);
  }, []);

  useEffect(() => {
    getChatbyId(chatId)
      .then((chat) => setCurrentChat(chat))
      .catch((error) => console.log(error));
  }, []);


  useEffect(() => (
    getUserId()
  ));

  /* Render Component */

  return (<>
    <div className="chat">

      <div className="message-container">
        {currentChat?.messages.map((message) => (
          <div key={message.id}>
            {message.from !== userId ? (
              <div className="message foreign-user">
                <div className="time">
                  {message.createdAt}
                </div>
                <div className="username">
                  {currentChat.foreignUserName}
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

      <div className="chat-input">
        <input
        type="text"
        name="message"
        value={inputValue}
        onChange={handleChange}
        />
        <button
        onClick={handleClick}
        >Send</button>
      </div>

    </div>
    
  </>);
};