import { Context } from 'koa';
import * as itemModel from '../models/item.model';
import { IItem } from '../types';

export async function getAllItems (ctx: Context) {
  const userId = ctx.userId;
  
  try {
    const result = await itemModel.getAll(userId);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function createItem (ctx:Context) {
  const userId = ctx.userId;
  const itemData = ctx.request.body as Partial<IItem>;
  console.log('itemData', itemData)

  if (!itemData) ctx.throw(400, { message: 'No item data provided.' });

  try {
    const newItem = await itemModel.createOne(userId, itemData);
    ctx.status = 201;
    ctx.body = newItem;
    console.log('success')
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function findItem (ctx:Context) {
  const itemId = ctx.params.itemid;
  const userId = ctx.userId;
  const userLocation = ctx.location;

  if (!itemId || !userLocation) {
    ctx.status = 400;
    ctx.body = { 
      messsage: !itemId ? 'No item ID provided.' : 'No user ID was provided.'
    };
    return;
  }
  
  try {
    const item = await itemModel.findItemById(itemId, userId, userLocation);
    ctx.status = 201;
    ctx.body = item;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function findItemsByCollectionId (ctx:Context) {
  const collectionId = ctx.params.collectionid;

  if (!collectionId) ctx.throw(400, { messsage: 'No collection ID provided.' });

  try {
    const items = await itemModel.findItemsByCollection(collectionId);
    ctx.status = 201;
    ctx.body = items;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function updateItemById (ctx: Context) {
  const itemId = ctx.params.itemid;
  const { name, img_url, value, description, lendable, collections } = ctx.request.body as Partial<IItem>;
  const itemData = { name, img_url, value, description, lendable, collections };

  if (!itemId) ctx.throw(400, { message: 'No item ID provided.' });

  try {
    const items = await itemModel.updateOne(itemId, itemData);
    ctx.status = 201;
    ctx.body = items;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function reserveItem (ctx: Context) {
  const userId = ctx.userId;
  const itemId = ctx.params.itemid;

  if (!itemId) ctx.throw(400, { message: 'No item ID provided.' });
    
  try {
    const result = await itemModel.reserveItem(userId, itemId);
    ctx.status = 201;
    ctx.body = result;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function receiveItem (ctx: Context) {
  const userId = ctx.userId;
  const itemId = ctx.params.itemid;

  if (!itemId) ctx.throw(400, { message: 'No item ID provided.' });

  try {
    const result = await itemModel.recieveItem(userId, itemId);
    ctx.status = 201;
    ctx.body = result;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function returnItem (ctx: Context) {
  const userId = ctx.userId;
  const itemId = ctx.params.itemid;

  if (!itemId) ctx.throw(400, { message: 'No item ID  provided.' });

  try {
    const result = await itemModel.returnItem(userId, itemId);
    ctx.status = 201;
    ctx.body = result;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function cancelItem (ctx: Context) {
  const userId = ctx.userId;
  const itemId = ctx.params.itemid;

  if (!itemId) ctx.throw(400, { message: 'No item ID provided.' });

  try {
    const result = await itemModel.cancelReserveItem(userId, itemId);
    ctx.status = 201;
    ctx.body = result;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function deleteItem (ctx:Context) {
  const itemId = ctx.params.itemid;

  if (!itemId) ctx.throw(400, { message: 'No item ID provided.' });
    
  try {
    await itemModel.deleteOne(itemId);
    ctx.status = 200;
    ctx.body = { success: true };
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}




