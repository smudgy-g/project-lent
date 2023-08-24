import { ReactNode, SetStateAction, createContext, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { Chat, ChatPreview, Message, User } from "../types/types";
import { getAllChats } from "../service/apiService";

/* Socket Context */

export interface SocketContextProps {
  chats: ChatPreview[] | null;
  currentChatId: string | null;
  setCurrentChatId: React.Dispatch<SetStateAction<string | null>>;
  currentItemId: string | null;
  setCurrentItemId: React.Dispatch<SetStateAction<string | null>>;
  userId: string;
  sendMessage: ((messageData: Message) => void) | null;
  currentChat: Chat | null;
  setCurrentChat: React.Dispatch<SetStateAction<Chat | null>>;
  unreadCount: number | null;
  setUnreadCount: React.Dispatch<SetStateAction<number | null>>;
};

export const SocketContext = createContext<SocketContextProps>({
  chats: null,
  currentChatId: null,
  setCurrentChatId: () => {},
  currentItemId: null,
  setCurrentItemId: () => {},
  userId: '',
  sendMessage: null,
  currentChat: null,
  setCurrentChat: () => {},
  unreadCount: 0,
  setUnreadCount: () => {},
});

/* Socket Provider */

interface SocketProviderProps {
  children: ReactNode;
};

export default function SocketProvider ({ children }: SocketProviderProps) {

  const [chats, setChats] = useState<ChatPreview[] | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [userId, setUserId] = useState<User['id']>('');

  const socketRef = useRef<Socket | null>(null);

  // Initialize component
  useEffect(() => {
    getAndSetUserId();
  }, []);

  // Get data for all chats, process it,
  // and set the chats state variable
  useEffect(() => {
    if (userId) {
      getAllChats()
        .then((chats) => {
          chats = chats.filter((chat) => chat.id !== userId)
          chats = addUnreadCount(chats);
          chats = sortChats(chats);
          setChats(chats);
          setUnreadCount(sumUnreadCounts(chats));
        })
        .catch((error) => console.log(error));
    }
  }, [userId]);

  // Helper for adding the count of unread messages to every chat
  function addUnreadCount(chats: ChatPreview[]) {
    const chatsWithUnreadMessages = chats.map((chat) => {
      const unreadMessages = chat.messages.reduce((acc, message) => {
        const seen = message.from?.user === userId ? message.from.seen : message.to?.seen;
        return seen ? acc : acc + 1;
      }, 0);
      chat.unreadMessages = unreadMessages;
      return chat;
    });
    return chatsWithUnreadMessages
  }

  // Helper for sorting the chats according to the newest message
  function sortChats (chats: ChatPreview[]) {
    return chats.sort((a, b) => {
      const createdAtA = new Date(a.messages.at(-1)?.createdAt as string)
      const createdAtB = new Date(b.messages.at(-1)?.createdAt as string)

      return createdAtB.getTime() - createdAtA.getTime();
    });
  }

  // Helper for summing up all unread counts of chats
  function sumUnreadCounts (chats: ChatPreview[]) {
    return chats.reduce((acc, chat) => {
      const unreadCount = chat.unreadMessages ?? 0;
      return acc + unreadCount;
    }, 0)
  }

  // When the current chat ID changes
  useEffect(() => {
    if (chats && currentChatId) {
      // Set the current item ID accordingly
      const itemId = chats.filter((chat) => chat?.id === currentChatId)[0].itemId!;
      setCurrentItemId(itemId);
      // Mark the chat as "seen", by setting
      // its unread messages counter to 0
      const updatedChats = chats.map((chat) => {
        if (chat.id === currentChatId) chat.unreadMessages = 0;
        return chat;
      })
      setChats(updatedChats);
      // Recalculate the accumulative unread count
      setUnreadCount(sumUnreadCounts(updatedChats));
    }
  }, [currentChatId]);

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
  function getAndSetUserId () {
    const userIdObject = getCookieValue('_auth_state');
    if (userIdObject) {
      const parsedUserIdObject = JSON.parse(userIdObject);
      const userId = parsedUserIdObject._id;
      setUserId(userId);
    }
  };

  // Initialize the socket connection and its listeners
  useEffect(() => {
    socketRef.current = io('http://localhost:5001');
    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to server with id:', socket!.id);
    })

    socket.on('new_message_in_room', (message) => {
      setCurrentChat((prevChat) => {
        return {
          ...prevChat!,
          messages: [
            message,
            ...prevChat!.messages,
          ],
        }
      })
    });

    // Cleanup
    return () => {
      socket.off("connect");
      socket.off("new_message_in_room");
      socket.close();
    };
  }, []);

  // When the currentChatId changes, join specified room
  useEffect(() => {
    const socket = socketRef.current;

    if (socket && currentChatId && userId) {
      socket.emit('join_chat', currentChatId, userId);
    }

    // Cleanup
    return () => {
      if (socket) socket.off("join_chat");
    }
  }, [currentChatId]);

  // Helper for sending messages to the specified room
  function sendMessage (messageData: Message) {
    const socket = socketRef.current;

    if (socket && currentChatId) {
      socket.emit('message_from_client', currentChatId, messageData);
    }
  }

  // Context exports
  const values: SocketContextProps = {
    chats,
    currentChatId,
    setCurrentChatId,
    currentItemId,
    setCurrentItemId,
    userId,
    sendMessage,
    currentChat,
    setCurrentChat,
    unreadCount,
    setUnreadCount
  };

  /* Render Component */

  return (
    <SocketContext.Provider value={values}>
      {children}
    </SocketContext.Provider>
  );
};