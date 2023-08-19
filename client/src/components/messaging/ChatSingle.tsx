import { useEffect, useState, useRef } from "react";
import { Chat, User, MessageToSend} from "../../types/types";
import { getChatbyId, postMessage } from "../../service/apiService";
import { Link } from "react-router-dom";

interface ChatSingleProps {
  currentChatId: string | null;
  currentItemId: string | null;
}

export default function ChatSingle ({ currentChatId, currentItemId }: ChatSingleProps) {

  /* State Variables */

  const [inputValue, setInputValue] = useState<string>('');
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [userId, setUserId] = useState<User['id']>('');
  const [currentMessageData, setCurrentMessageData] = useState<MessageToSend | null>();

  /* Hooks */
  const messageEndRef = useRef<HTMLDivElement>(null);

  /* Use Effect */

  // Initialize component
  useEffect(() => {
    getAndSetUserId();
  }, []);

  // Get current chat data
  useEffect(() => {
    if (currentChatId) {
      getChatbyId(currentChatId)
        .then((chat) => setCurrentChat(chat))
        .catch((error) => console.log(error));
    }
  }, [currentChatId]);

  useEffect(() => {
    setCurrentMessageData({
      body: inputValue,
      from: userId,
      to: currentChat?.foreignUserId,
      seen: false,
    });
  }, [inputValue]);

  useEffect(()=> (
    scrollToBottom()
  ), [currentChat?.messages]);

  /* Handler Functions */

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  };

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if(event.key === 'Enter') {
      handleSendClick();
    }
  };

  async function handleSendClick() {
    await postMessage(currentMessageData!, currentChatId!);
    setInputValue('');
    getChatbyId(currentChatId!)
      .then((chat) => setCurrentChat(chat))
      .catch((error) => console.log(error));
  };

  /* More Helper Functions, apparently */

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
  function getAndSetUserId () {
    const userIdObject = getCookieValue('_auth_state');
    const parsedUserIdObject = JSON.parse(userIdObject);
    const userId = parsedUserIdObject._id;
    setUserId(userId);
  };

  // Helper function to scroll down to the lowest message
  function scrollToBottom () {
    messageEndRef.current?.scrollIntoView({behavior: undefined});
  };

  /* Render Component */

  return (<>
    <div className="chat">

      <div className="chat-header">
        <h1>{currentChat && currentChat.item.name}</h1>
        <Link to={`/item/${currentItemId}`}><button className="button arrow-right">Item</button></Link>
      </div>

      <div className="message-container">
        {currentChat && currentChat.messages
          .slice()
          .reverse()
          .map((message, index) => (
              <div key={index} className={`message ${message.from !== userId ? 'foreign-user' : 'user'}`}>
                <div className="datetime">
                  {message.createdAt.toString().substring(11, 16)}
                </div>
                <div className="message-body">
                  {message.body}
                </div>
                <div className="scroll-reference" ref={messageEndRef}></div>
              </div>
          ))
        }
      </div>
    </div>

    <div className="chat-input-container">
      <input
        type="text"
        name="message"
        value={inputValue}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        autoComplete='false'
        autoFocus={true}
      />

      <button className="button send styled large"
        onClick={handleSendClick}
      >
        Send
      </button>
    </div>
  </>);
};