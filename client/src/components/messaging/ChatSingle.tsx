import { useEffect, useState, useContext } from "react";
import { getChatbyId } from "../../service/apiService";
import { Link } from "react-router-dom";
import { SocketContext, SocketContextProps } from "../../contexts/SocketContext";

interface ChatSingleProps {
  currentChatId: string | null;
  currentItemId: string | null;
}

export default function ChatSingle ({ currentChatId, currentItemId }: ChatSingleProps) {

  const [inputValue, setInputValue] = useState<string>('');

  const {
    userId,
    sendMessage,
    currentChat,
    setCurrentChat,
  } = useContext<SocketContextProps>(SocketContext);

  // Get the current chat’s data
  useEffect(() => {
    if (currentChatId) {
      getChatbyId(currentChatId)
        .then((chat) => setCurrentChat(chat))
        .catch((error) => console.log(error));
    }
  }, [currentChatId]);

  // Scroll down when new messages arrive
  useEffect(()=> {
    scrollToBottom();
  }, [currentChat?.messages]);

  // Helper function for scrolling down to the bottom message
  function scrollToBottom () {
    const messageContainer = document.querySelector('.message-container');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  };

  /* Handler Functions */

  // Keep the input value updated
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  };

  // When the user presses the “Enter” key, send the message
  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if(event.key === 'Enter') {
      handleClickSend();
    }
  };

  // When the user clicks send, construct the message
  // and send it, then reset the input field
  async function handleClickSend() {
    const messageData = {
      body: inputValue,
      from: {
        user: userId,
        seen: false,
      },
      to: {
        user: currentChat?.foreignUserId!,
        seen: false,
      },
      createdAt: (new Date()).toISOString(),
    };

    if (sendMessage) {
      sendMessage(messageData);
      setInputValue('');
    }
  };

  /* Render Component */

  return (<>
    <div className="chat">

      <div className="chat-header">
        <h1>{currentChat && currentChat.item.name}</h1>
        <Link to={`/item/${currentItemId}`}><button className="button arrow-right-circle">Item</button></Link>
      </div>

      <div className="message-container">
        {currentChat && currentChat.messages
          .slice()
          .reverse()
          .map((message, index) => (
            <div key={index} className={`message ${message.from.user === userId ? 'user' : 'foreign-user'}`}>
              <div className="datetime">
                {message.createdAt?.toString().substring(11, 16)}
              </div>
              <div className="message-body">
                {message.body}
              </div>
            </div>
          ))
        }
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
          onClick={handleClickSend}
        >
          Send
        </button>
      </div>
    </div>

  </>);
};