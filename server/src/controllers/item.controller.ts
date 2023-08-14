import { Context } from 'koa';
import { getAll, createOne, findItemById } from '../models/item.model';

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
  const { name } = ctx.request.body as any;
  if (!name) {
    ctx.status = 400;
    ctx.body = { messsage: 'No data was supplied.' };
    return;
  }
  try {
    const newItem = await createOne(name, userId);
    ctx.status = 201;
    ctx.body = newItem;
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

export async function findItemsByCollection (ctx:Context) {
  const id = ctx.params.id;
  if (!id) {
    ctx.status = 400;
    ctx.body = { messsage: 'No collection ID supplied.' };
    return;
  }
  try {
    const items = await findItemsByCollection(id);
    ctx.status = 201;
    ctx.body = items;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

// export async function deleteCollection (ctx:Context) {
//   const id = ctx.params.id;
//   if (!id) {
//     ctx.status = 400;
//     ctx.body = { message: 'No collection ID was supplied.' };
//     return;
//   }

//   try {
//     const result = await deleteOne(id);
//     ctx.status = 200;
//     ctx.body = result;
//   } catch (error) {
//     ctx.status = 500;
//     ctx.body = { message: error };
//   }
// }

// export async function updateCollectionName (ctx:Context) {
//   const { id, newName } = ctx.request.body as any;
//   if (!id) {
//     ctx.status = 400;
//     ctx.body = { message: 'No collection ID was supplied.' };
//     return;
//   }

//   try {
//     const result = await updateName(id, newName);
//     ctx.status = 200;
//     ctx.body = result;
//   } catch (error) {
//     ctx.status = 500;
//     ctx.body = { message: error };
//   }
// }

