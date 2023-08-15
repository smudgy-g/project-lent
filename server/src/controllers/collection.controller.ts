import { Context } from 'koa';
import * as collectionModel from '../models/collection.model';

export async function getAllCollections (ctx: Context) {
  /* This will be the user id from the JWT */
  const id = ctx.userId;
  if (!id) {
    ctx.status = 400;
    ctx.body = { message: 'User ID was not supplied.' };
    return;
  }
  try {
    const result = await collectionModel.getAll(id);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

export async function createCollection (ctx:Context) {
  const userId = ctx.userId;
  const { name } = ctx.request.body as any;
  if (!name) {
    ctx.status = 400;
    ctx.body = { messsage: 'No name was supplied.' };
    return;
  }
  
  try {
    const newCollection = await collectionModel.createOne(name, userId);
    ctx.status = 201;
    ctx.body = newCollection;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

export async function deleteCollection (ctx:Context) {
  const id = ctx.params.id;
  if (!id) {
    ctx.status = 400;
    ctx.body = { message: 'No collection ID was supplied.' };
    return;
  }

  try {
    await collectionModel.deleteOne(id);
    ctx.status = 200;
    ctx.body = { success: true };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

export async function updateCollectionName (ctx: Context) {
  const { id, newName } = ctx.request.body as any;
  if (!id) {
    ctx.status = 400;
    ctx.body = { message: 'No collection ID was supplied.' };
    return;
  }

  try {
    const result = await collectionModel.updateName(id, newName);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

