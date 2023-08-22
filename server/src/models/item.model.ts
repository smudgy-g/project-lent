import { IGeoLocation, IItem } from "../types";
import { Item } from "./schemas/item.schema";
import * as collectionModel from "./collection.model";
import { User } from "./schemas/user.schema";
import { Types } from "mongoose";
import { Collection } from "./schemas/collection.schema";
import { createChat } from "../models/chat.model";
import { getItemLocations, sortByDistanceFromUser, itemDistanceFromUser } from '../utilities/location';
import { transferValue, changeCredits } from "./user.model";

export async function getAll (id: string): Promise<Partial<IItem>[] | null> {
  try {
    const userId = new Types.ObjectId(id);
    const data = await Item.find({ user: userId });

    const items = data.map(item => ({
      _id: item._id.toString(),
      name: item.name,
      img_url: item.img_url,
      value: item.value,
      description: item.description,
      lendable: item.lendable,
      available: item.available,
      borrowed: item.borrowed,
    }));

    return items;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function findItemById (itemId: string, userId: string, userLocation: IGeoLocation) {
 try {
    const itemIdObject = new Types.ObjectId(itemId);
    const item = await Item.findById(itemIdObject);

    if (!item) return null;
    if (userId === item.user.toString()) return item;
    
    const distance = await itemDistanceFromUser(userLocation, item.user);
    return ({
      _id: item._id,
      user: item.user,
      name: item.name,
      img_url: item.img_url,
      value: item.value,
      description: item.description,
      lendable: item.lendable,
      available: item.available,
      collections: item.collections,
      borrowed: item.borrowed, 
      distance: distance
    })
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createOne (userId: string, itemData: Partial<IItem>): Promise<IItem | null> {
  try {
    let collectionObjArray: Types.ObjectId[] | undefined;
    const userIdObject = new Types.ObjectId(userId);
    const user = await User.findById(userIdObject);

    if (!user) throw new Error('User not found.');

    const allCollectionId = await collectionModel.getCollectionIdByName(userIdObject, 'All');
    
    if (!allCollectionId) throw new Error('Could not find the "All" collection.'); // maybe we create an all collection

    if (itemData.collections && itemData.collections.length) {
      collectionObjArray = itemData.collections.map(col => new Types.ObjectId(col));
    } else if (!itemData.collections){
      collectionObjArray = [];
    }

    const newItem = new Item({
      user: userIdObject,
      collections: [...(collectionObjArray || []), allCollectionId],
      available: itemData.lendable,
      ...itemData,
    });

    return newItem.save().then(savedItem => {
      const itemId = savedItem._id;
      newItem.collections.map(collection => collectionModel.addItemToCollection(collection.toString(), itemId))
    })
    .then(() => newItem);
  } catch (error) {
    console.error(error)
    throw error;
  }
}

export async function findItemsByCollection(collectionId: string): Promise<Partial<IItem>[] | null> {
  try {
    const collectionIdObject = new Types.ObjectId(collectionId);
    const data = await Collection.aggregate([
      {
        $match: { _id: collectionIdObject }
      },
      {
        $lookup: {
          from: 'items', // collection to join
          localField: 'items', // 'item' on the Collection model
          foreignField: '_id', // field to reference from the Item collection
          as: 'items'
        }
      },
      {
        $unwind: '$items'
      },
      {
        $project: {
          _id: 0,
          'items._id': 1,
          'items.name': 1,
          'items.description': 1,
          'items.img_url': 1,
          'items.value': 1,
          'items.lendable': 1,
          'items.available': 1,
          'items.borrowed': 1
        }
      }
    ]);

    const items = data.map(item => ({
      _id: item.items._id.toString(),
      name: item.items.name,
      img_url: item.items.img_url,
      value: item.items.value,
      description: item.items.description,
      lendable: item.items.lendable,
      available: item.items.available,
      borrowed: item.items.borrowed
    }));
    
    return items;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateOne (itemId: string, itemData: Partial<IItem>) {
  try {
    const itemIdObj = new Types.ObjectId(itemId);
    const { user, collections,...updatedData } = itemData;
    const item = await Item.findById(itemIdObj).select({ 'lendable': 1, 'user': 1, 'collections': 1 });
    
    if (item && collections) {
      const userIdObj = new Types.ObjectId(item.user)
      const allCollectionId = await collectionModel.getCollectionIdByName(userIdObj, 'All');
      collections.push(allCollectionId.toString());
      
      // Check for removed items
      for (let i = 0; i < item.collections.length; i++) {
        const originalCollection = item.collections[i].toString();
        if (!collections.includes(originalCollection)) {
          await collectionModel.removeItemFromCollection(originalCollection, itemId);
        }
      }
      // Check for added items
      const originalCollection = item.collections.map(c => c.toString());
      for (let i = 0; i < collections.length; i++) {
        const updatedCollection = collections[i];
        if (!originalCollection.includes(updatedCollection)) {
          await collectionModel.addItemToCollection(updatedCollection.toString(), itemId);
        }
      }
      
      if (item.lendable !== itemData.lendable) {
        if (itemData.lendable) await changeCredits(item.user, 50);
        else if (!itemData.lendable) await changeCredits(item.user, -50)
      }
      const res = await Item.findByIdAndUpdate(itemIdObj, {
        ...updatedData, 
        $addToSet: { $each: { collections } },
      }, { new: true });
      return res
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteOne (itemId:string): Promise<IItem | null> {
  try {
    return Item.findByIdAndDelete(itemId);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function reserveItem (userId: string, itemId: string) {
  try {
    const userIdObject = new Types.ObjectId(userId);
    const itemIdObject = new Types.ObjectId(itemId);
    const item = await Item.findById(itemIdObject).select({ 'user': 1, 'name': 1, '_id': 0 });
    const reservedCollectionId = await collectionModel.getCollectionIdByName(userIdObject, 'Reserved');

    if (item) {
      await collectionModel.addItemToCollection(reservedCollectionId, itemId);
      
      await Item.findByIdAndUpdate(itemIdObject, {
        $set: { available: false, borrowed: false },
        $push: { collections: reservedCollectionId }
      });

      const message = `There is interest in the ${item.name}!`
      const newChat = await createChat(itemId, item.user.toString(), userId, message);
      return newChat;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function cancelReserveItem (userId: string, itemId: string) {
  try {
    const userIdObject = new Types.ObjectId(userId);
    const itemIdObject = new Types.ObjectId(itemId);
    const item = await Item.findById(itemIdObject).select({ 'user': 1, 'name': 1, '_id': 0 });
    let reservedCollectionId;

    if (item && userId !== item.user.toString()) reservedCollectionId = await collectionModel.getCollectionIdByName(userIdObject, 'Reserved');
    else if (item && userId === item.user.toString()) reservedCollectionId = await collectionModel.getCollectionIdByName(item.user, 'Reserved');
    
    await collectionModel.removeItemFromCollection(reservedCollectionId, itemId);
    return await Item.findByIdAndUpdate(itemIdObject, {
      $set: { available: true, borrowed: false, lendable: true },
      $pull: { collections: reservedCollectionId }
    }, { new: true });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function recieveItem (userId: string, itemId: string) {
  try {
    const userIdObject = new Types.ObjectId(userId);
    const itemIdObject = new Types.ObjectId(itemId);
    const item = await Item.findById(itemIdObject).select({ 'user': 1, 'name': 1, 'value': 1, '_id': 0 });
    const borrowedCollectionId = await collectionModel.getCollectionIdByName(userIdObject, 'Borrowed');
    const reservedCollectionId = await collectionModel.getCollectionIdByName(userIdObject, 'Reserved');
    
    if (item && item.value && reservedCollectionId && borrowedCollectionId) {
      const transferSuccess = await transferValue(item.user, userIdObject, item.value);

      if (transferSuccess) {
        const lentOutCollectionId = await collectionModel.getCollectionIdByName(item.user, 'Lent Out');
        await collectionModel.removeItemFromCollection(reservedCollectionId, itemId);
        await collectionModel.addItemToCollection(lentOutCollectionId, itemId);
        await collectionModel.addItemToCollection(borrowedCollectionId, itemId);
        const borrowedObjectId = new Types.ObjectId(borrowedCollectionId);
        const lentOutObjectId = new Types.ObjectId(lentOutCollectionId);
        const collectionIds = [borrowedObjectId, lentOutObjectId];

        await Item.findByIdAndUpdate(itemIdObject, {
          $set: { borrowed: true },
          $pull: { collections: reservedCollectionId },
        }, { new: true } );
        return await Item.findByIdAndUpdate(itemIdObject, {
          $addToSet: { collections: { $each: collectionIds } }
        }, { new: true } );
      } else {
        return null;
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function returnItem (userId: string, itemId: string) {
  try {
    const userIdObject = new Types.ObjectId(userId);
    const itemIdObject = new Types.ObjectId(itemId);
    const borrower = await User.aggregate([
      { $match: { _id: userIdObject } },
      {
        $lookup: {
          from: 'chats',
          localField: 'inbox',
          foreignField: '_id',
          as: 'chats'
        }
      },
      { $unwind: '$chats'},
      { $match: { 'chats.item': itemIdObject } },
      {
        $project: {
          borrowerId: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$chats.users',
                  cond: { $ne: ['$$this', userIdObject] }
                }
              }
            ]
          }
        }
      }
    ])
    console.log(borrower[0]);
    const item = await Item.findById(itemIdObject).select({ 'user': 1, 'name': 1, 'value': 1, '_id': 0 });
    const lentOutCollectionId = await collectionModel.getCollectionIdByName(userIdObject, 'Lent Out');
    
    if (item && borrower) {
      const borrowedCollectionId = await collectionModel.getCollectionIdByName(borrower[0]._id, 'Borrowed');
      const borrowedObjectId = new Types.ObjectId(borrowedCollectionId);
      const lentOutObjectId = new Types.ObjectId(lentOutCollectionId);
      
      await collectionModel.removeItemFromCollection(lentOutCollectionId, itemId);
      await collectionModel.removeItemFromCollection(borrowedCollectionId, itemId);
      
      return await Item.findByIdAndUpdate(itemIdObject, {
        $set: { borrowed: false, available: true },
        $pullAll: { collections: [borrowedObjectId, lentOutObjectId] }
      }, { new: true } );
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function searchByQuery (query: string, userLocation: IGeoLocation, userId: string) {
  const userIdObj = new Types.ObjectId(userId);
  try {
    const result = await Item.aggregate([
      {
        $search: {
          index: "search",
          autocomplete: {
            query: query,
            path: "name"
          }
        },
      },
      {
        $match: { 'user': { $ne : userIdObj } }
      }
    ]);
    const resultWithLocations: any = await getItemLocations(result);
    return sortByDistanceFromUser(userLocation, resultWithLocations);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function discoverItems (userLocation: IGeoLocation, userId: string) {
  try {
    const userIdObj = new Types.ObjectId(userId);
    const result = await Item.find({ 'user': { $ne: userIdObj } });
    const resultWithLocations: any = await getItemLocations(result);
    return sortByDistanceFromUser(userLocation, resultWithLocations);
  } catch (error) {
    console.error(error);
    throw error;
  }
} 
