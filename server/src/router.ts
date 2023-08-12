import Router from 'koa-router';
// import controllers
import * as user from './controllers/user.controller';

const router = new Router();

router.get('/', async (ctx, next) => {
  ctx.body = { msg: 'Moin moin.' };
  await next();
});

router.post('/register', user.createOne);

// Add routes for app here
export default router

