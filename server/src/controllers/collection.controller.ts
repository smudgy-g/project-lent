import { Context } from 'koa';
import { getAllCollections, createOne, deleteOne, findCollectionById } from '../models/collection.model';

export async function getAllCollecttions (ctx: Context) {
  /* This will be the user id from the JWT */
  const id = ctx.params.id;
  if (!id) {
    ctx.status = 400;
    ctx.body = 'User ID was not supplied.';
    return;
  }
  try {
    const result = await getAllCollections(id);

    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.status = 500;
    ctx.body = error;
  }
}

export async function createCollection (ctx:Context) {
  const { name } = ctx.request.body as any;
  if (!name) {
    ctx.status = 400;
    ctx.body = 'No name was supplied.';
    return;
  }
  /* error handle for collection already existing based on user._id !!! */
  // need the client._id from the JJWT object

  try {
    const result = await createOne(name);
    ctx.status = 201;
    ctx.body = result;
  } catch (error) {
    ctx.status = 500;
    ctx.body = error;
  }
}

export async function deleteCollection (ctx:Context) {
  const id = ctx.params.id;
  if (!id) {
    ctx.status = 400;
    ctx.body = 'No collection ID was supplied.';
    return;
  }

  try {
    const result = await deleteOne(id);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.status = 500;
    ctx.body = error;
  }
}
