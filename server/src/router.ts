import Router from 'koa-router';
// import controllers

const router = new Router();

router.get('/', async (ctx, next) => {
  ctx.body = { msg: 'Moin moin.' };
  await next();
});

router.post('/register', )
// Add routes for app here
export default router;
