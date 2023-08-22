import { Socket } from 'socket.io';
import { io } from '../index';
import { handleJoinRoom, handleSendMessage, handleLeaveRoom } from './socketListener.controller';

let sockets: Socket[] = [];

const ioConnect = (io: any) => {
  io.on('connection', (socket: Socket) => {
    sockets.push(socket);

    socket.on('join_chat', async (chatId, userId) => {
      handleJoinRoom(socket, chatId, userId);
    });

    socket.on('send_message', async (message) => {
      socket.emit('receive_message', message);
    });

    socket.on('leave_chat', (chatId) => {
      handleLeaveRoom(socket, chatId);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
      // handleDisconnect(socket);
    });
  });
};

export { ioConnect };