import { Context } from 'koa';
import * as itemModel from '../models/item.model';
import { IItem } from '../types';

export async function getAllItems (ctx: Context) {
  const userId = ctx.userId;
  if (!userId) {
    ctx.status = 400;
    ctx.body = { message: 'User ID was not supplied.' };
    return;
  }

  try {
    const result = await itemModel.getAll(userId);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

export async function createItem (ctx:Context) {
  const userId = ctx.userId;
  
  const itemData = ctx.request.body as Partial<IItem>;
  console.log('user id:', userId);
  console.log('item:', itemData);

  if (!itemData) {
    ctx.status = 400;
    ctx.body = { messsage: 'No data was supplied.' };
    return;
  } else if (!userId) {
    ctx.status = 400;
    ctx.body = { messsage: 'No user ID was supplied.' };
    return;
  }
  try {
    const newItem = await itemModel.createOne(userId, itemData);
    ctx.status = 201;
    ctx.body = newItem;
    console.log('success')
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

export async function findItem (ctx:Context) {
  const itemId = ctx.params.itemid;
  const userId = ctx.userId;
  const userLocation = ctx.location;

  if (!itemId) {
    ctx.status = 400;
    ctx.body = { messsage: 'No item ID supplied.' };
    return;
  } else if (!userLocation) {
    ctx.status = 400;
    ctx.body = { messsage: 'No user ID was supplied.' };
    return;
  } else if (!userId) {
    ctx.status = 400;
    ctx.body = { messsage: 'No user ID was supplied.' };
    return;
  }
  
  try {
    const item = await itemModel.findItemById(itemId, userId, userLocation);
    ctx.status = 201;
    ctx.body = item;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

export async function findItemsByCollectionId (ctx:Context) {
  const collectionId = ctx.params.collectionid;

  if (!collectionId) {
    ctx.status = 400;
    ctx.body = { messsage: 'No collection ID supplied.' };
    return;
  }

  try {
    const items = await itemModel.findItemsByCollection(collectionId);
    ctx.status = 201;
    ctx.body = items;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

export async function updateItemById (ctx: Context) {
  const itemId = ctx.params.itemid;
  const { name, img_url, value, description, lendable, collections } = ctx.request.body as Partial<IItem>;
  const itemData = { name, img_url, value, description, lendable, collections };

  if (!itemId) {
    ctx.status = 400;
    ctx.body = { messsage: 'No item ID supplied.' };
    return;
  }

  try {
    const items = await itemModel.updateOne(itemId, itemData);
    ctx.status = 201;
    ctx.body = items;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

export async function reserveItem (ctx: Context) {
  const userId = ctx.userId;
  const itemId = ctx.params.itemid;

  if (!itemId) {
    ctx.status = 400;
    ctx.body = { message: 'No item ID was supplied.' };
    return;
  }

  try {
    const result = await itemModel.reserveItem(userId, itemId);
    ctx.status = 201;
    ctx.body = result;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

export async function receiveItem (ctx: Context) {
  const userId = ctx.userId;
  const itemId = ctx.params.itemid;

  if (!itemId) {
    ctx.status = 400;
    ctx.body = { message: 'No item ID was supplied.' };
    return;
  }

  try {
    const result = await itemModel.recieveItem(userId, itemId);
    ctx.status = 201;
    ctx.body = result;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

export async function returnItem (ctx: Context) {
  const userId = ctx.userId;
  const itemId = ctx.params.itemid;
  const { foreignUserId } = ctx.request.body;

  if (!itemId) {
    ctx.status = 400;
    ctx.body = { message: 'No item ID was supplied.' };
    return;
  }

  try {
    const result = await itemModel.returnItem(userId, itemId, foreignUserId);
    ctx.status = 201;
    ctx.body = result;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

export async function cancelItem (ctx: Context) {
  const userId = ctx.userId;
  const itemId = ctx.params.itemid;

  if (!itemId) {
    ctx.status = 400;
    ctx.body = { message: 'No item ID was supplied.' };
    return;
  }

  try {
    const result = await itemModel.cancelReserveItem(userId, itemId);
    ctx.status = 201;
    ctx.body = result;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

export async function deleteItem (ctx:Context) {
  const itemId = ctx.params.itemid;

  if (!itemId) {
    ctx.status = 400;
    ctx.body = { message: 'No item ID was supplied.' };
    return;
  }

  try {
    await itemModel.deleteOne(itemId);
    ctx.status = 200;
    ctx.body = { success: true };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}




