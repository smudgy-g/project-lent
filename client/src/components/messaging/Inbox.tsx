import { useEffect, useState, useContext } from "react";
import { getAllChats } from "../../service/apiService";
import { ChatPreview } from "../../types/types";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import { SocketContext, SocketContextProps } from "../../contexts/SocketContext";

import ChatSingle from "./ChatSingle";

function InboxCombined() {

  const [chats, setChats] = useState<ChatPreview[] | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const { userId, setCurrentContextChatId } = useContext<SocketContextProps>(SocketContext);

  // Initialize the header
  useEffect(() => {
    setActionButtonGroupData([]);
  }, []);

  // Get data for all chats
  useEffect(() => {
    if (userId) {
      getAllChats()
        .then((chats) => {
          chats = chats.filter((chat) => chat.id !== userId)
          chats = addUnreadCount(chats);
          console.log(chats);

          setChats(chats);
        })
        .catch((error) => console.log(error));
    }
  }, [userId]);

  // Helper for adding the count of unread messages to every chat
  function addUnreadCount(chats: ChatPreview[]) {
    const chatsWithUnreadMessages = chats.map((chat) => {
      const unreadMessages = chat.messages.reduce((acc, message) => {
        const seen = message.from.user === userId ? message.from.seen : message.to.seen;
        return seen ? acc : acc + 1;
      }, 0);
      chat.unreadMessages = unreadMessages;
      return chat;
    });
    return chatsWithUnreadMessages
  }

  // // Helper for sorting the chats according to the newest message
  function sortChats (chats: ChatPreview[]) {
  //   return chats
  }

  // Make sure the first chat is always selected,
  // when the component loads and the chats were loaded
  useEffect(() => {
    if (chats && !currentChatId) {
      setCurrentChatId(chats[0].id);
      setCurrentContextChatId(chats[0].id);
      setCurrentItemId(chats[0].itemId!);
    }
  }, [chats])

  // When the current chat ID changes,
  // set the current item ID accordingly
  useEffect(() => {
    if (chats && currentChatId) {
      const itemId = chats.filter((chat) => chat.id === currentChatId)[0].itemId!;
      setCurrentItemId(itemId);
    }
  }, [chats, currentChatId])

  /* Event Handlers */

  // When the user clicks on a chat
  function handleChatClick (chatId: string) {
    setCurrentChatId(chatId);
    setCurrentContextChatId(chatId);
  }

  /* Render Component */

  return (<>
    <div className="inbox">
      <div className="chat-preview-container">
      {chats && chats
        .map((chat, index) => (
        <div className={`chat-preview-wrapper ${chat.id === currentChatId ? 'active' : ''}`} key={index}>
          <div className="chat-preview" onClick={() => handleChatClick(chat.id)} style={{backgroundImage: `url(${chat.img_url})`}}></div>
        </div>
      ))}
      </div>

      {chats && <ChatSingle currentChatId={currentChatId} currentItemId={currentItemId} />}
    </div>

  </>);
}

export default InboxCombined;
