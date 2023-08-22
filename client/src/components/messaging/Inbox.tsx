import { useEffect, useState, useContext } from "react";
import { getAllChats } from "../../service/apiService";
import { ChatPreview } from "../../types/types";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import ChatSingle from "./ChatSingle";
import { io, Socket } from 'socket.io-client';
import { SocketContext, SocketContextProps } from "../../contexts/SocketContext";



function InboxCombined() {

  /* State Variables */

  const [chats, setChats] = useState<ChatPreview[] | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);

  /* Hooks */

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const { setCurrentContextChatId } = useContext<SocketContextProps>(SocketContext);

  /* Handler Functions */

  function handleChatClick (chatId: string) {
    setCurrentChatId(chatId);
    setCurrentContextChatId(chatId);
  }

  /* Use Effect */

  useEffect(() => {
    setActionButtonGroupData([]);
  }, []);

  // Get data for all chats
  useEffect(() => {
    getAllChats()
      .then((chats) => setChats(chats))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (chats) {
      setCurrentChatId(chats[0].id);
      setCurrentContextChatId(chats[0].id);
      setCurrentItemId(chats[0].itemId!);
    }
  }, [chats])

  useEffect(() => {
    if (chats && currentChatId) {
      const itemId = chats.filter((chat) => chat.id === currentChatId)[0].itemId!;
      setCurrentItemId(itemId);
    }
  }, [chats, currentChatId])

  /* Render Component */

  return (<>
    <div className="inbox">
      <div className="chat-preview-container">
      {chats && chats.map((chat, index) => (
        <div className={`chat-preview-wrapper ${chat.id === currentChatId ? 'active' : ''}`}>
          <div className="chat-preview" key={index} onClick={() => handleChatClick(chat.id)} style={{backgroundImage: `url(${chat.img_url})`}}></div>
        </div>
      ))}
      </div>

      <ChatSingle currentChatId={currentChatId} currentItemId={currentItemId} />
    </div>

  </>);
}

export default InboxCombined;
