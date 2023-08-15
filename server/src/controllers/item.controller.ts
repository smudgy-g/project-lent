import { Context } from 'koa';
import { getAll, createOne, findItemById, deleteOne, findItemsByCollection, updateOne } from '../models/item.model';
import { IItem } from '../_types';

export async function getAllItems (ctx: Context) {
  const id = ctx.userId;
  if (!id) {
    ctx.status = 400;
    ctx.body = { message: 'User ID was not supplied.' };
    return;
  }
  try {
    const result = await getAll(id);
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
  if (!itemData) {
    ctx.status = 400;
    ctx.body = { messsage: 'No data was supplied.' };
    return;
  }
  try {
    const newItem = await createOne(userId, itemData);
    ctx.status = 201;
    ctx.body = newItem;
    console.log('success')
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

export async function findItem (ctx:Context) {
  const id = ctx.params.id;
  if (!id) {
    ctx.status = 400;
    ctx.body = { messsage: 'No item ID supplied.' };
    return;
  }
  try {
    const item = await findItemById(id);
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
    const items = await findItemsByCollection(collectionId);
    ctx.status = 201;
    ctx.body = items;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

export async function updateItemById (ctx: Context) {
  const id = ctx.params.id;
  const { name, img_url, value, description, lendable, collections } = ctx.request.body as Partial<IItem>;
  const itemData = { name, img_url, value, description, lendable, collections };

  if (!id) {
    ctx.status = 400;
    ctx.body = { messsage: 'No item ID supplied.' };
    return;
  }

  try {
    const items = await updateOne(id, itemData);
    ctx.status = 201;
    ctx.body = items;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

export async function deleteItem (ctx:Context) {
  const id = ctx.params.id;
  if (!id) {
    ctx.status = 400;
    ctx.body = { message: 'No item ID was supplied.' };
    return;
  }

  try {
    await deleteOne(id);
    ctx.status = 200;
    ctx.body = { success: true };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}


