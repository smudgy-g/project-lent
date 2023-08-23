import { useEffect, useState, useContext } from "react";
import { Message } from "../../types/types";
import { getChatbyId } from "../../service/apiService";
import { Link } from "react-router-dom";
import { SocketContext, SocketContextProps } from "../../contexts/SocketContext";



interface ChatSingleProps {
  currentChatId: string | null;
  currentItemId: string | null;
}

export default function ChatSingle ({ currentChatId, currentItemId }: ChatSingleProps) {

  const [inputValue, setInputValue] = useState<string>('');
  const [currentMessageData, setCurrentMessageData] = useState<Message | null>();

  const {
    userId,
    sendMessage,
    currentChat,
    setCurrentChat,
  } = useContext<SocketContextProps>(SocketContext);

  /* Use Effect */

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
      from: {
        user: userId,
        seen: false,
      },
      to: {
        user: currentChat?.foreignUserId!,
        seen: false,
      },
      createdAt: (new Date()).toISOString(),
    });
  }, [inputValue]);

  useEffect(()=> {
    scrollToBottom();
  }, [currentChat?.messages]);

  /* Handler Functions */

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  };

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if(event.key === 'Enter') {
    handleClickSend();
    }
  };

  async function handleClickSend() {
    if (sendMessage && currentMessageData) {
      sendMessage(currentMessageData);
      setInputValue('');
    }
  };

  // Helper function to scroll down to the lowest message
  function scrollToBottom () {
    const messageContainer = document.querySelector('.message-container');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
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