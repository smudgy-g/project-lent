import Router from 'koa-router';
// import controllers
import * as user from './controllers/user.controller';
import * as collection from './controllers/collection.controller';

const router = new Router();

router.get('/', async (ctx, next) => {
  ctx.body = { msg: 'Moin moin.' };
  await next();
});

// user routes
router.get('/user/:id', user.getUserById);

// collection routes

/* This will be the user id from the JWT & not the params */
router.get('/collection/all/:id', collection.getAllCollecttions);

router.post('/collection', collection.createCollection);
router.delete('/collection/:id', collection.deleteCollection);
router.put('/collection/:id', );

// register routes
router.post('/register', user.createOne);

// Add routes for app here
export default router;
