import { Context } from 'koa';
import * as chatModel from '../models/chat.model'

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

export async function deleteChat (ctx:Context) {
  const id = ctx.params.id;
  if (!id) {
    ctx.status = 400;
    ctx.body = { message: 'No collection ID was supplied.' };
    return;
  }

  try {
    await chatModel.deleteOne(id);
    ctx.status = 200;
    ctx.body = { success: true };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

// export async function getAllCollections (ctx: Context) {
//   /* This will be the user id from the JWT */
//   const id = ctx.userId;
//   if (!id) {
//     ctx.status = 400;
//     ctx.body = { message: 'User ID was not supplied.' };
//     return;
//   }
//   try {
//     const result = await collectionModel.getAll(id);
//     ctx.status = 200;
//     ctx.body = result;
//   } catch (error) {
//     ctx.status = 500;
//     ctx.body = { message: error };
//   }