import { ReactNode, SetStateAction, createContext, useCallback, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { Chat, Message, User } from "../types/types";

/* Socket Context */

export interface SocketContextProps {
  setCurrentContextChatId: React.Dispatch<SetStateAction<string>>;
  userId: string;
  sendMessage: ((messageData: Message) => void) | null;
  currentChat: Chat | null;
  setCurrentChat: React.Dispatch<SetStateAction<Chat | null>>;
};

export const SocketContext = createContext<SocketContextProps>({
  setCurrentContextChatId: () => {},
  userId: '',
  sendMessage: null,
  currentChat: null,
  setCurrentChat: () => {},
});

/* Socket Provider */

interface SocketProviderProps {
  children: ReactNode;
};

export default function SocketProvider ({ children }: SocketProviderProps) {

  const [currentChatId, setCurrentContextChatId] = useState<string>('');
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  const [userId, setUserId] = useState<User['id']>('');
  const socketRef = useRef<Socket | null>(null);

  // Initialize component
  useEffect(() => {
    getAndSetUserId();
  }, []);

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
    setCurrentContextChatId,
    userId,
    sendMessage,
    currentChat,
    setCurrentChat,
  };

  /* Render Component */

  return (
    <SocketContext.Provider value={values}>
      {children}
    </SocketContext.Provider>
  );
};