import { useEffect, useState, useContext } from "react";
import { deleteChat, getAllChats } from "../../service/apiService";
import { ChatPreview } from "../../types/types";
import { Link } from 'react-router-dom'
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";

function Inbox() {

  /* State Variables */

  const [chats, setChats] = useState<ChatPreview[] | null>(null)

  /* Hooks */

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);

  /* Handler Functions */

  async function handleDeleteChat (chatId: string) {
    await deleteChat(chatId)
      .then(() => {
        getAllChats()
          .then((chats) => setChats(chats))
          .catch((error)=> console.log(error))
      })
      .catch((error) => console.log(error));
  }

  /* Use Effect */

  useEffect(() => {
    setActionButtonGroupData([]);
  }, []);

  useEffect(() => {
    getAllChats()
      .then((chats) => setChats(chats))
      .catch((error) => console.log(error));
  }, []);

  /* Render Component */

  return (<>
    <div className="inbox">

      <h1>Chats</h1>
      <div className="chat-preview-container">
      {chats && chats.map((chat) => (
        <div className="chat-preview" key={chat.id}>
          <Link key={chat.id} to={`/chat/${chat.id}`}>
              <div className="chat-preview-text">
                <div className="datetime">{new Date(chat.updatedAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  timeZone: "UTC"
                })}</div>
                <div className="itemname">{chat.itemName}</div>
                <div className="message">{`${chat.foreignUser}: ${chat.message}`}</div>
              </div>
          </Link>
          <button className="button delete" onClick={() => handleDeleteChat(chat.id)}>Delete</button>
        </div>
      ))}
      </div>
    </div>

  </>);
}

export default Inbox;