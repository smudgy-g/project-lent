import { Context } from "koa";
import { searchByQuery, discoverItems } from "../models/item.model";

export async function searchItem (ctx: Context) {
  const userLocation = ctx.location;
  const userId = ctx.userId;
  const searchQuery = decodeURIComponent(ctx.query.query as string);
  
  if (!searchQuery) ctx.throw(400, { message: 'No search query provided.'});

  try {
    const result = await searchByQuery(searchQuery, userLocation, userId);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function discover (ctx: Context) {
  const userLocation = ctx.location;
  const userId = ctx.userId;
  
  try {
    const result = await discoverItems(userLocation, userId);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}