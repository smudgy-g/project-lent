import { useEffect, useState, useContext } from "react";
import { getAllChats } from "../../service/apiService";
import { ChatPreview } from "../../types/types";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import ChatSingle from "./ChatSingle";

function InboxCombined() {

  /* State Variables */

  const [chats, setChats] = useState<ChatPreview[] | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);

  /* Hooks */

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);

  /* Handler Functions */

  function handleChatClick (chatId: string) {
    setCurrentChatId(chatId);
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
        <div className={`chat-preview-wrapper ${chat.id === currentChatId ? 'active' : ''}`} key={index}>
          <div className="chat-preview" onClick={() => handleChatClick(chat.id)} style={{backgroundImage: `url(${chat.img_url})`}}></div>
        </div>
      ))}
      </div>

      <ChatSingle currentChatId={currentChatId} currentItemId={currentItemId} />
    </div>

  </>);
}

export default InboxCombined;