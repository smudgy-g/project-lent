import { useEffect, useState, useContext, useRef } from "react";
import { Chat, User, MessageToSend, Item} from "../../types/types";
import { useParams } from 'react-router-dom'
import { getChatbyId, postMessage, putItemById } from "../../service/apiService";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";

export default function ChatSingle() {

  /* State Variables */

  const [inputValue, setInputValue] = useState<string>('');
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [userId, setUserId] = useState<User['id']>('');
  const [currentMessageData, setCurrentMessageData] = useState<MessageToSend | null>();
  const [itemReceivedData, setItemReceivedData] = useState<Item | null>();
  const [itemReturnedData, setItemReturnedData] = useState<Item | null>();

  /* State Variables Buttons */

  const [cancelButtonIsDisabled, setCancelButtonIsDisabled] = useState<boolean>(false);
  const [receivedButtonBorrowerIsDisabled, setReceivedButtonBorrowerIsDisabled] = useState<boolean>(false);
  const [returnedButtonBorrowerIsDisabled, setReturnedButtonBorrowerIsDisabled] = useState<boolean>(true);
  const [receivedButtonOwnerIsDisabled, setReceivedButtonOwnerIsDisabled] = useState<boolean>(true);
  const [returnedButtonOwnerIsDisabled, setReturnedButtonOwnerIsDisabled] = useState<boolean>(true);

  /* Hooks */
  const {chatId} = useParams();
  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const messageEndRef = useRef<HTMLDivElement>(null);

  /* Handler Functions */

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  };  

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if(event.key === 'Enter') {
      handleClick();
    }
  };
  
  async function handleClick() {
    await postMessage(currentMessageData!, chatId!);
    setInputValue('');
    getChatbyId(chatId!)
      .then((chat) => setCurrentChat(chat))
      .catch((error) => console.log(error));
  };

  async function handleItemReturned(itemId : string) {
    // await putItemById(itemId, itemReturnedData!);
    console.log(itemReturnedData);
    setReceivedButtonOwnerIsDisabled(true);
  };

  async function handleItemReceived(itemId: string) {
    // await putItemById(itemId, itemReceivedData!);
    console.log(itemReceivedData);
    setReturnedButtonBorrowerIsDisabled(false);
    setCancelButtonIsDisabled(true);
    setReceivedButtonOwnerIsDisabled(false);
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

  // Helper function to scroll down to the lowest message
  function scrollToBottom () {
    messageEndRef.current?.scrollIntoView({behavior: undefined});
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

  useEffect(() => {
    setCurrentMessageData({
      body: inputValue,
      from: userId,
      to: currentChat?.foreignUserId,
      seen: false,
    });
  }, [inputValue]);

  useEffect(() => {
    setItemReturnedData({
      _id: currentChat?.item._id!,
      borrowed: false,
    });
  }, [currentChat]);

  useEffect(() => {
    setItemReceivedData({
      _id: currentChat?.item._id!,
      borrowed: true,
    });
  }, [currentChat]);

  useEffect(()=> (
    scrollToBottom()
  ), [currentChat?.messages]);

  /* Render Component */

  return (<>
    <div className="chat">

      <div className="message-container">
        {currentChat && currentChat.messages
        .slice()
        .reverse()
        .map((message, index) => (
          <div key={index}>
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
                <div ref={messageEndRef}></div>
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
                <div ref={messageEndRef}></div>
              </div>
            )
            }
          </div>
        ))}
      </div>

    </div>
    
    <div>
      {currentChat && currentChat.item.user === userId ? (
        <div className="button-group">
          <button className="button" disabled={cancelButtonIsDisabled}>Cancel</button>
          <button className="button" disabled={receivedButtonOwnerIsDisabled}>Received Item</button>
          <button className="button" onClick={() => handleItemReturned(currentChat?.item!._id)} disabled={returnedButtonOwnerIsDisabled}>Returned Item</button>
        </div>
        ) : (
          <div className="button-group">
          <button className="button" disabled={cancelButtonIsDisabled} >Cancel</button>
          <button className="button" disabled={returnedButtonBorrowerIsDisabled}>Returned Item</button>
          <button className="button" onClick={() => handleItemReceived(currentChat!.item!._id)} disabled={receivedButtonBorrowerIsDisabled}>Received Item</button>
        </div>
        )
      }
    </div>

    <div className="chat-input-container">

      <input
        type="text"
        name="message"
        value={inputValue}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />

      <button className="button"
        onClick={handleClick}
        >Send
      </button>

    </div>    
  </>);
};