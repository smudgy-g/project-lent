import { useEffect, useState } from "react";
import { Chat } from "../../types/types";
import { useParams } from 'react-router-dom'
import { getChatbyId } from "../../service/apiService";

function Chat() {

  /* State Variables */

  const [currentChat, setCurrentChat] = useState<Chat | null>(null)

  /* Hooks */
  const {chatId} = useParams()

  /* Use Effect */
  useEffect(() => {
    getChatbyId(chatId)
      .then((chat) => setCurrentChat(chat))
      .catch((error) => console.log(error));
  })

  /* Render Component */

  return (<>
    <div className="chat">
      
    </div>
    
  </>);
}

export default Chat;