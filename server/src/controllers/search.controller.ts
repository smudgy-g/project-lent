import { Context } from "koa";
import { searchByQuery, discoverItems } from "../models/item.model";

export async function searchItem (ctx: Context) {
  try {
    const userLocation = ctx.location;
    const userId = ctx.userId;
    const searchQuery = decodeURIComponent(ctx.query.query as string);
    if (!searchQuery) {
      ctx.status = 400;
      ctx.body = { message: 'No search query provided.'};
      return;
    }
    const result = await searchByQuery(searchQuery, userLocation, userId);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error};
  }
}

export async function discover (ctx: Context) {
  try {
    const userLocation = ctx.location;
    const userId = ctx.userId;
    const result = await discoverItems(userLocation, userId);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error};
  }
}