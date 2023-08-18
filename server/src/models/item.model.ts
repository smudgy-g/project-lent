import { IGeoLocation, IItem } from "../types";
import { Item } from "./schemas/item.schema";
import * as collectionModel from "./collection.model";
import { User } from "./schemas/user.schema";
import { Types } from "mongoose";
import { Collection } from "./schemas/collection.schema";
import { createChat } from "../models/chat.model";
import { getItemLocations, sortByDistanceFromUser, itemDistanceFromUser } from '../utilities/location';
import { transferValue } from "./user.model";

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

//// add distance

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
    const userIdObject = new Types.ObjectId(userId);
    const user = await User.findById(userIdObject);
    if (!user) {
      throw new Error('User not found.');
    }

    const allCollection = await collectionModel.findCollectionByName('All');
    
    if (!allCollection) {
      throw new Error('Could not find the "All" collection.');
    }
    const allCollectionId = new Types.ObjectId(allCollection._id);

    const newItem = new Item({
      user: userIdObject,
      collections: [...(itemData.collections || []), allCollectionId],
      available: itemData.lendable,
      ...itemData,
    });

    return newItem.save().then(savedItem => {
      const itemId = savedItem._id;
      collectionModel.addItemToCollection(allCollectionId.toString(), itemId)
    })
    .then(() => newItem);
  } catch (error) {
    console.log('model error', error)
    throw error;
  }
}

export async function findItemsByCollection(collectionId: string): Promise<Partial<IItem>[] | null> {
  try {
    // COnvert the collection ID to a objectId type
    const collectionIdObject = new Types.ObjectId(collectionId);
   // Use the aggregation pipeline with $lookup to retrieve items for the collection
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

export async function updateOne (id: string, itemData: Partial<IItem>) {
  try {
    const { user, ...updatedData } = itemData;
    const updatedItem = await Item.findByIdAndUpdate(id, updatedData, { new: true });
    return updatedItem;
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
    throw error
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
    // get item user id
  try {
    const userIdObject = new Types.ObjectId(userId);
    const itemIdObject = new Types.ObjectId(itemId);
    const item = await Item.findById(itemIdObject).select({ 'user': 1, 'name': 1, '_id': 0 });
    let reservedCollectionId;
    // if user id !== item user -> userId is the borrower
    if (item && userId !== item.user.toString()) reservedCollectionId = await collectionModel.getCollectionIdByName(userIdObject, 'Reserved');
    // if user id === item user -> userId is the owner
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
    const borrower = await User.findById(userIdObject).select({ 'username': 1 });
    const item = await Item.findById(itemIdObject).select({ 'user': 1, 'name': 1, 'value': 1, '_id': 0 });
    const borrowedCollectionId = await collectionModel.getCollectionIdByName(userIdObject, 'Borrowed');
    const reservedCollectionId = await collectionModel.getCollectionIdByName(userIdObject, 'Reserved');
    const owner = await User.findById(item!.user).select({ 'username': 1 })
    
    if (item && item.value) {
      const lentOutCollectionId = await collectionModel.getCollectionIdByName(item.user, 'Lent Out');

      await collectionModel.removeItemFromCollection(reservedCollectionId, itemId);
      await collectionModel.addItemToCollection(lentOutCollectionId, itemId);
      await collectionModel.addItemToCollection(borrowedCollectionId, itemId);
      
      await transferValue(item.user, userIdObject, item.value);
      
      const updatedItem = await Item.findByIdAndUpdate(itemIdObject, {
        $set: { borrowed: true },
        $pull: { collections: reservedCollectionId },
        $push: { collections: { $each: [borrowedCollectionId, lentOutCollectionId] } }
      }, { new: true } );

      // const message = `${borrower!.username} sent ${item.value} credits to ${owner!.username}`
      // createChat(itemId, item.user.toString(), userId, message);

      return updatedItem;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function returnItem (userId: string, itemId: string) {
  try {
    const userIdObject = new Types.ObjectId(userId); // owner
    const itemIdObject = new Types.ObjectId(itemId);
    const borrower = await User.findById(userIdObject).select({ 'username': 1 });
    const item = await Item.findById(itemIdObject).select({ 'user': 1, 'name': 1, 'value': 1, '_id': 0 });
    const lentOutCollectionId = await collectionModel.getCollectionIdByName(userIdObject, 'Lent Out');
    const owner = await User.findById(item!.user).select({ 'username': 1 })
    
    if (item && item.value) {
      const borrowedCollectionId = await collectionModel.getCollectionIdByName(item.user, 'Borrowed');
      
      await collectionModel.removeItemFromCollection(lentOutCollectionId, itemId);
      await collectionModel.removeItemFromCollection(borrowedCollectionId, itemId);
      
      const updatedItem = await Item.findByIdAndUpdate(itemIdObject, {
        $set: { borrowed: false, available: true },
        $pull: { collections: { $each: [borrowedCollectionId, lentOutCollectionId] } }
      }, { new: true } );
      
      return updatedItem;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function searchByQuery (query: string, userLocation: IGeoLocation, userId: string) {
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
        $match: { 'user': { $ne : userId } }
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
    const result = await Item.find({ 'user': { $ne: userId } });
    const resultWithLocations: any = await getItemLocations(result);
    return sortByDistanceFromUser(userLocation, resultWithLocations);
  } catch (error) {
    console.error(error);
    throw error;
  }
} 

/* item marked as returned */
// _id: 289347732 (itemid), borrowed: false

/* item marked as returned */
// _id: 289347732 (itemid), borrowed: false