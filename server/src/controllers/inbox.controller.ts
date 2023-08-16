import { Context } from 'koa';
import * as chatModel from '../models/chat.model';
import * as messageModel from '../models/message.model';
import { IMessage } from '../_types';

export async function getAllChats (ctx: Context) {
  const userId = ctx.userId;

  try {
    const chats = await chatModel.getAllChats(userId);
    ctx.status = 200;
    ctx.body = chats;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
  
}

export async function getChatById (ctx: Context) {
  const chatId = ctx.params.chatid;
  const userId = ctx.userId;

  try {
    const chat = await chatModel.getChatById(chatId, userId);
    ctx.status = 200;
    ctx.body = chat;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
  
}

export async function deleteChat (ctx:Context) {
  const { chatId }: any = ctx.request.body;

  if (!chatId) {
    ctx.status = 400;
    ctx.body = { message: 'No chat ID was supplied.' };
    return;
  }

  try {
    await chatModel.deleteOne(chatId);
    ctx.status = 200;
    ctx.body = { success: true };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

export async function postMessage (ctx: Context) {
  const message = ctx.request.body as IMessage;
  const userId = ctx.userId;
  try {
    const result = await messageModel.postMessage(message);
    ctx.status = 201;
    ctx.body = result;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { messsage: error };
  }
}
