import { Context } from 'koa';
import * as chatModel from '../models/chat.model';
import * as messageModel from '../models/message.model';
import { IChat, IMessage } from '../types';

export async function getAllChats (ctx: Context) {
  const userId = ctx.userId;

  try {
    const chats = await chatModel.getAllChats(userId);
    ctx.status = 200;
    ctx.body = chats;
  } catch (error) {
    ctx.throw(500, { message: error });
  }

}

export async function getChatById (ctx: Context) {
  const chatId = ctx.params.chatid;
  const userId = ctx.userId;

  if (!chatId) ctx.throw(400, { message: 'No chat ID provided.' });

  try {
    const chat = await chatModel.getChatById(chatId, userId);
    ctx.status = 200;
    ctx.body = chat;
  } catch (error) {
    ctx.throw(500, { message: error });
  }

}

export async function deleteChat (ctx:Context) {
  const chatId = ctx.params.chatid;

  if (!chatId) ctx.throw(400, { message: 'No chat ID provided.' });

  try {
    await chatModel.deleteOne(chatId);
    ctx.status = 200;
    ctx.body = { success: true };
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function postMessage (ctx: Context) {
  const chatId = ctx.params.chatid;
  const message = ctx.request.body as IMessage;

  if (!chatId) ctx.throw(400, { message: 'No chat ID provided.' });
  if (!message) ctx.throw(400, { message: 'No message provided.' });

  try {
    const result = await messageModel.postMessage(message, chatId);
    ctx.status = 201;
    ctx.body = result;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function updateMessage (ctx: Context) {

  const messageid = ctx.params.messageid;
  const message = ctx.request.body as Partial<IMessage>;
  if (!message) ctx.throw(400, { message: 'No message details provided.' })
  try {
    const result = await messageModel.updateMessage(message, messageid);
    ctx.status = 201;
    ctx.body = result;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function createChat (ctx: Context) {
  const userId = ctx.userId;
  const { itemId, ownerId } = ctx.request.body as any;

  if (!itemId || !ownerId) ctx.throw(400, { message: 'Request body missing required data.' });

  try {
    const result = await chatModel.createChat(itemId, ownerId, userId);

    ctx.status = 201;
    ctx.body = result;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}
