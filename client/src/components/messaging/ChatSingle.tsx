import { useEffect, useState, useContext, useRef } from "react";
import { Chat, User, MessageToSend, Item} from "../../types/types";
import { useParams, useNavigate } from 'react-router-dom'
import { deleteChat, getChatbyId, getItemById, postMessage, receiveItemById, returnItemById } from "../../service/apiService";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";

export default function ChatSingle() {

  /* State Variables */

  const [inputValue, setInputValue] = useState<string>('');
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [userId, setUserId] = useState<User['id']>('');
  const [currentMessageData, setCurrentMessageData] = useState<MessageToSend | null>();
  const [itemReceivedData, setItemReceivedData] = useState<Item | null>();
  const [itemReturnedData, setItemReturnedData] = useState<Item | null>();
  const [currentItem, setCurrentItem] = useState<Item | null>();

  const [cancelButton, setCancelButton] = useState<boolean>(false)
  const [receivedButton, setReceivedButton] = useState<boolean>(false)
  const [returnedButton, setReturnedButton] = useState<boolean>(true)

  /* Hooks */
  const {chatId} = useParams();
  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate()

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
    await postMessage(currentMessageData!, chatId!);
    setInputValue('');
    getChatbyId(chatId!)
      .then((chat) => setCurrentChat(chat))
      .catch((error) => console.log(error));
  };

  async function handleItemReturnClick(itemId : string) {
    await returnItemById(itemId);
    console.log(itemReturnedData);
  };

  async function handleItemReceiveClick(itemId: string) {
    await receiveItemById(itemId);
    console.log(itemReceivedData);
  };

  async function handleCancelClick() {
    // cancelTransactionRoute
    navigate(-1)
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
    if(currentChat?.item._id){
    getItemById(currentChat?.item!._id!)
      .then((item) => setCurrentItem(item))
      .catch((error) => console.log(error));
    };
    if(currentItem?.borrowed === true) {
      setReceivedButton(true)
      setReturnedButton(false);
      setCancelButton(true);
    };
  }, [currentChat]);


  useEffect(() => {
    setCurrentMessageData({
      body: inputValue,
      from: userId,
      to: currentChat?.foreignUserId,
      seen: false,
    });
  }, [inputValue]);

  // useEffect(() => {
  //   setItemReturnedData({
  //     _id: currentChat?.item._id!,
  //     borrowed: false,
  //   });
  // }, [currentChat]);

  // useEffect(() => {
  //   setItemReceivedData({
  //     _id: currentChat?.item._id!,
  //     borrowed: true,
  //   });
  // }, [currentChat]);

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
          <>
            {message.from !== userId ? (
              <div key={index} className="message foreign-user">
                <div className="datetime">
                  {message.createdAt.toString().substring(11, 16)}
                </div>
                <div className="message-body">
                  {message.body}
                </div>
                <div className="scroll-reference" ref={messageEndRef}></div>
              </div>
            ) : (
              <div key={index} className="message user">
                <div className="datetime">
                  {message.createdAt.toString().substring(11, 16)}
                </div>
                <div className="message-body">
                  {message.body}
                </div>
                <div className="scroll-reference" ref={messageEndRef}></div>
              </div>
            )
            }
          </>
        ))}
      </div>

    </div>

    <>
    {currentChat && currentChat.item.user === userId ? (
      <div className="button-group chat-button-group">
        <button className="button styled large" onClick={() => handleCancelClick()} disabled={cancelButton}>Cancel</button>
        <button className="button styled large" onClick={() => handleItemReturnClick(currentChat?.item!._id)} disabled={returnedButton}>Returned Item</button>
      </div>
      ) : (
        <div className="button-group chat-button-group">
        <button className="button styled large" disabled={cancelButton} onClick={() => handleCancelClick()}>Cancel</button>
        <button className="button styled large" onClick={() => handleItemReceiveClick(currentChat!.item!._id)} disabled={receivedButton}>Received Item</button>
      </div>
      )
    }
    </>

    <div className="chat-input-container">

      <input
        type="text"
        name="message"
        value={inputValue}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />

      <button className="button send styled large"
        onClick={handleSendClick}
        >Send
      </button>

    </div>
  </>);
};