import Router from 'koa-router';
import { authMiddleware } from './middleware/auth.middleware';
import * as user from './controllers/user.controller';
import * as collection from './controllers/collection.controller';
import * as auth from './controllers/auth.controller'
import { Context } from 'koa';

const router = new Router();

router.get('/', async (ctx, next) => {
  ctx.body = { msg: 'Moin moin.' };
  await next();
});

// user routes
router.get('/user/:id', user.getUserById);
router.put('/user/:id', (ctx: Context) => {
  ctx.body ='Update User'
});
router.delete('/user/:id', (ctx: Context) => {
  ctx.body ='Delete user'
});

/* Not sure if needed */
// router.post('/user/', (ctx: Context) => {
//   ctx.body ='Login'
// });

// collection routes

/* This will be the user id from the JWT & not the params */
router.get('/collection/all/:id', authMiddleware, collection.getAllCollecttions);

router.post('/collection', authMiddleware, collection.createCollection);
router.delete('/collection/:id', collection.deleteCollection);
router.put('/collection/:id', (ctx: Context) => {
  ctx.body ='Update Collection'
});

// auth routes
router.post('/register', user.createOne);
router.post('/login', auth.login)

// Add routes for app here
export default router;
