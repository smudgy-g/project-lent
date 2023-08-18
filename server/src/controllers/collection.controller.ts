import { Context } from 'koa';
import * as collectionModel from '../models/collection.model';

export async function getAllCollections (ctx: Context) {
  const userId = ctx.userId;

  if (!userId) ctx.throw(400, { message: 'User ID not supplied.' });

  try {
    const result = await collectionModel.getAll(userId);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function createCollection (ctx:Context) {
  const userId = ctx.userId;
  const { name } = ctx.request.body as any;

  if (!name) ctx.throw(400, { message: 'No name supplied.' });
  
  try {
    const newCollection = await collectionModel.createOne(name, userId);
    ctx.status = 201;
    ctx.body = newCollection;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function deleteCollection (ctx:Context) {
  const id = ctx.params.id;

  if (!id) ctx.throw(400, { message: 'No collection ID supplied.' });

  try {
    await collectionModel.deleteOne(id);
    ctx.status = 200;
    ctx.body = { success: true };
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function updateCollectionName (ctx: Context) {
  const { id, newName } = ctx.request.body as any;

  if (!id) ctx.throw(400, { message: 'No collection ID supplied.' });

  try {
    const result = await collectionModel.updateName(id, newName);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

