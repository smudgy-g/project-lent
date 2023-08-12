import Router from 'koa-router';
// import controllers

export const router = new Router();

router.get('/', async (ctx, next) => {
  ctx.body = {msg: "Moin moin."};
  await next();
})

// Add routes for app here