import { IGeoLocation, IItem } from "../types";
import { Item } from "./schemas/item.schema";
import { addItemToCollection, findCollectionByName } from "./collection.model";
import { User } from "./schemas/user.schema";
import { Types } from "mongoose";
import { Collection } from "./schemas/collection.schema";
import { createChat } from "../models/chat.model";
import { distanceBetweenPoints } from '../helpers/distance';

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

export async function findItemById (id: string): Promise<IItem | null> {
  try {
    const itemId = new Types.ObjectId(id);
    return await Item.findById(itemId);
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

    const allCollection = await findCollectionByName('All');
    
    if (!allCollection) {
      throw new Error('Could not find the "All" collection.');
    }
    const allCollectionId = new Types.ObjectId(allCollection._id);

    const newItem = new Item({
      user: userIdObject,
      collections: [...(itemData.collections || []), allCollectionId],
      ...itemData,
    });

    return newItem.save().then(savedItem => {
      const itemId = savedItem._id;
      addItemToCollection(allCollectionId.toString(), itemId)
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
        $match: {
          _id: collectionIdObject
        }
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

// reserve item function

export async function reserveItem (userId: string, itemId: string) {
  try {
    const itemIdObject = new Types.ObjectId(itemId);
    // get owner id from item
    const ownerId = await Item.findById(itemIdObject).select({ 'user': 1, '_id': 0 });
    const itemName = await Item.findById(itemIdObject).select({ 'name': 1, '_id': 0 });

    if (ownerId && itemName ) {
      await Item.findByIdAndUpdate(itemIdObject, {
        $set: { available: false }
      });
      // create  new chat with message 'Interest in your item'
      const message = `There is interest in the ${itemName}!`
      const newChat = await createChat(itemId, ownerId.toString(), userId, message);
      // return new cchat id
      console.log(newChat)
      return newChat?._id;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function searchByQuery (query: string, userLocation: IGeoLocation, userId: string) {
  try {
    const result = await Item.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort(
      { score: { $meta: 'textScore' } }
    );
    const filteredResults = result.filter((item: IItem) => item.user.toString() !== userId)
    // const resultWithDistance: any = await distanceBetweenPoints(userLocation, result);
    return filteredResults;
  } catch (error) {
    console.error(error);
    throw error;
  }
}