import { Socket } from 'socket.io';
import { handleJoinRoom, handleLeaveRoom, handleSendMessage } from './socketListener.controller';

const ioConnect = (io: any) => {
  io.on('connection', (socket: Socket) => {
    console.log('connected to:', socket.id);

    socket.on('join_chat', async (chatId, userId) => {
      await handleJoinRoom(socket, chatId, userId);
    });

    socket.on('message_from_client', async (chatId, message) => {
      await handleSendMessage(chatId, message);
    });

    socket.on('leave_chat', async (chatId) => {
      await handleLeaveRoom(socket, chatId);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

export { ioConnect };