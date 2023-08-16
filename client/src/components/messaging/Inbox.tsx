import { useEffect, useState, useContext } from "react";
import { getAllChats } from "../../service/apiService";
import { Chat, ChatPreview } from "../../types/types";
import { Link } from 'react-router-dom'
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";

function Inbox() {

  /* State Variables */

  const [chats, setChats] = useState<ChatPreview[] | null>(null)

  /* Hooks */

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);

  /* Handler Functions */

  function handleDeleteChat () {
    console.log('executed')
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

      <div>Chats</div>

      {chats && chats.map((chat) => (
        <div className="chat-preview" key={chat.id}>
          <Link key={chat.id} to={`/chat/${chat.id}`}>
              <div className="chat-preview-text">
                <div>{new Date(chat.updatedAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  timeZone: "UTC"
                })}</div>
                <div>{chat.foreignUser}</div>
                <div>{chat.itemName}</div>
                <div>{chat.message}...</div>
              </div>
          </Link>
          <div>
            <button>Delete</button>
          </div>
        </div>
      ))}
    </div>
    
  </>);
}

export default Inbox;