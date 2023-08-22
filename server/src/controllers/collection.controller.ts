import { Context } from 'koa';
import * as collectionModel from '../models/collection.model';

export async function getAllCollections (ctx: Context) {
  const userId = ctx.userId;

  if (!userId) ctx.throw(400, { message: 'User ID not provided.' });

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
  const { itemName, itemIds } = ctx.request.body as any;
  if (!itemName) ctx.throw(400, { message: 'No name provided.' });
  
  try {
    const newCollection = await collectionModel.createOne(itemName, userId, itemIds);
    ctx.status = 201;
    ctx.body = newCollection;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function deleteCollection (ctx:Context) {
  const collectionId = ctx.params.id;
  console.log(collectionId)
  if (!collectionId) ctx.throw(400, { message: 'No collection ID provided.' });

  try {
    await collectionModel.deleteOne(collectionId);
    ctx.status = 200;
    ctx.body = { success: true };
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function updateCollectionName (ctx: Context) {
  const collectionId = ctx.params.id;
  const { newName } = ctx.request.body as any;

  if (!collectionId) ctx.throw(400, { message: 'No collection ID provided.' });
  if (!newName) ctx.throw(400, { message: 'No collection name provided.' });

  try {
    const result = await collectionModel.updateName(collectionId, newName);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function removeItemsFromCollection (ctx: Context) {
  const collectionId = ctx.params.id;
  const { items } = ctx.request.body as any;
  console.log(items)
  if (!collectionId) ctx.throw(400, { message: 'No collection ID provided.' });

  try {
    const result = await collectionModel.removeItemsFromCollection(collectionId, items);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(500, { message: error })
  }
}

export async function addItemsToCollections (ctx: Context) {
  const { itemIds, collectionIds } = ctx.request.body as any;

  if (!collectionIds || !itemIds) ctx.throw(400, { message: 'No collections or items provided.' });

  try {
    const result = await collectionModel.addItemsToCollections(collectionIds, itemIds);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(500, { message: error })
  }
}