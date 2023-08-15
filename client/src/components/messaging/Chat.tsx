import { useState, useEffect } from "react";
import { getChatbyId } from "../../service/apiService";

function Chat() {

  /* State Variables */

  // const [currentChat, setCurrentChat] = useState<Chat | null>(null)

  // /* Use Effect */

  // useEffect(() => {
  //   getChatbyId(chatId)
  //     .then((chat) => setCurrentChat(chat))
  //     .catch((error) => console.log(error));
  // }, []);

  /* Render Component */

  return (<>
    <div className="chat">

    </div>
    
  </>);
}

export default Chat;