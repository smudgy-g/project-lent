import { Socket } from 'socket.io';
import { io } from '../index';
import * as chatModel from '../models/chat.model';
import { postMessage } from '../models/message.model';
import { IMessage } from '../types';

async function handleJoinRoom(socket: Socket, chatId: string, userId: string) {
  socket.join(chatId);
  console.log(`User ID ${userId} joined chat ${chatId}`);

  const chat = await chatModel.getChatById(chatId, userId);
  if (chat) {
    io.emit('user_join', chat);
  }
}
async function handleSendMessage(chatId: string, message: IMessage) {
  console.log(`User ID ${message.from} sent in ${chatId} to ${message.to} the message : ${message.body}`);

  const newMessage = await postMessage(message, chatId);
  
  io.to(chatId).emit('new_message_in_room', message);
}

async function handleLeaveRoom(socket: Socket, chatId: string) {
  socket.leave(chatId);
  console.log(`User left chat ${chatId}`);
  io.emit('user_leaves', chatId);
}

export {
  handleSendMessage,
  handleJoinRoom,
  handleLeaveRoom,
};
