import { Context } from "koa";
import { searchByQuery } from "../models/item.model";

export async function searchItem (ctx: Context) {
  try {
    const searchQuery = decodeURIComponent(ctx.query.query as string);
    if (!searchQuery) {
      ctx.status = 400;
      ctx.body = { message: 'No search query provided.'};
      return;
    }
    const result = await searchByQuery(searchQuery);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error};
  }
}