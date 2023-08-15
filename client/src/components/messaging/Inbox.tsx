import { useEffect, useState, useContext } from "react";
import { getAllChats } from "../../service/apiService";
import { Chat } from "../../types/types";
import { Link } from 'react-router-dom'
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";

function Inbox() {

  /* State Variables */

  const [chats, setChats] = useState<Chat[] | null>(null)

  /* Hooks */

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);

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
        <Link key={chat.id} to={`/chat/${chat.id}`}>
          <div className="chat-thumbnail" key={chat.id}>
            <div>{chat.foreignUser}</div>
            <div>{chat.itemName}</div>
            {/* <div>{chat.message}</div> */}
            <button>Delete Chat</button>
          </div>
        </Link>
      ))}
    </div>
    
  </>);
}

export default Inbox;