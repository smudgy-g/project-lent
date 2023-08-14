import Router from 'koa-router';
import { authenticate } from './middleware/auth.middleware';
import * as user from './controllers/user.controller';
import * as collection from './controllers/collection.controller';
import * as auth from './controllers/auth.controller'
import * as item from './controllers/item.controller'
import { Context } from 'koa';

const router = new Router();

// user routes
router.get('/user/:id', user.getUserById);
router.put('/user/:id', (ctx: Context) => {
  ctx.body ='Update User'
});
router.delete('/user/:id', authenticate, user.deleteUser);

/* Not sure if needed */
// router.post('/user/', (ctx: Context) => {
//   ctx.body ='Login'
// });

// collection routes

router.get('/collection/all', authenticate, collection.getAllCollecttions);
router.post('/collection', authenticate, collection.createCollection);
router.delete('/collection/:id', authenticate, collection.deleteCollection);
router.put('/collection', authenticate, collection.updateCollectionName);

// auth routes
router.post('/register', user.createOne);
router.post('/login', auth.login);

// item routes
router.get('/item/all', authenticate, item.getAllItems);
router.get('/item/all/:collectionid', authenticate, item.findItemsByCollection);
router.get('/item/all/discover', );
router.get('/item/:id', authenticate, item.findItem);
router.post('/item', authenticate, item.createItem);
router.put('/item/:id', );
router.delete('/item/:id', );

// Add routes for app here
export default router;
