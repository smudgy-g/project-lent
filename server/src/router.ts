import Router from 'koa-router';
import { authenticate } from './middleware/auth.middleware';
import * as user from './controllers/user.controller';
import * as collection from './controllers/collection.controller';
import * as auth from './controllers/auth.controller';
import * as item from './controllers/item.controller';
import * as inbox from './controllers/inbox.controller';
import * as search from './controllers/search.controller';

const router = new Router();

// user routes
router.get('/user/:id', user.getUserById);
router.put('/user', authenticate, user.updateUser);
router.delete('/user', authenticate, user.deleteUser);

// collection routes

router.get('/collection/all', authenticate, collection.getAllCollections);
router.post('/collection', authenticate, collection.createCollection);
router.delete('/collection/:id', authenticate, collection.deleteCollection);
router.put('/collection', authenticate, collection.updateCollectionName);

// auth routes
router.post('/register', user.createOne);
router.post('/login', auth.login);

// item routes
router.get('/item/all', authenticate, item.getAllItems); //
router.get('/item/all/:collectionid', authenticate, item.findItemsByCollectionId); //
// router.get('/item/all/discover', );
router.get('/item/:itemid', authenticate, item.findItem);
router.post('/item', authenticate, item.createItem);
router.put('/item/:itemid', authenticate, item.updateItemById);
router.put('/item/:itemid/reserve', authenticate, item.reserveItem);
router.delete('/item/:itemid', authenticate, item.deleteItem);

// messaging routes
router.get('/inbox', authenticate, inbox.getAllChats);
router.get('/inbox/:chatid', authenticate, inbox.getChatById);
router.post('/inbox/', authenticate, inbox.createChat);
router.post('/inbox/:chatid', authenticate, inbox.postMessage);
router.delete('/inbox/', authenticate, inbox.deleteChat);

// search & discover routes
router.get('/item/all/discover');
/*
FRONT END CODE
 fetch(`/search?query=${encodeURIComponent(searchQuery)}`)
      .then((response) => response.json())
      .then((data) => {
        // Process the search results
        console.log(data);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
*/
router.get('/search', authenticate, search.searchItem);

export default router;
