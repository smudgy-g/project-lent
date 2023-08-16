import { IItem } from "../_types";
import { Item } from "./item.schema";
import { addItemToCollection, findCollectionById, findCollectionByName } from "./collection.model";
import { User } from "./user.schema";
import mongoose, { Schema } from "mongoose";
import { Collection } from "./collection.schema";

// need to return all the item data
export async function getAll (id: string): Promise<Partial<IItem>[] | null> {
  try {
    const userId = new mongoose.Types.ObjectId(id);
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

    console.log(items);
    return items;
  } catch (error) {
    throw error;
  }
}

export async function findItemById (id: string): Promise<IItem | null> {
  try {
    const itemId = new mongoose.Types.ObjectId(id);
    return await Item.findById(itemId);
  } catch (error) {
    throw error;
  }
}

export async function createOne (userId: string, itemData: Partial<IItem>): Promise<IItem | null> {
  try {
    const userIdObject = new mongoose.Types.ObjectId(userId);
    const user = await User.findById(userIdObject);
    if (!user) {
      throw new Error('User not found.');
    }

    const allCollection = await findCollectionByName('All');
    
    if (!allCollection) {
      throw new Error('Could not find the "All" collection.');
    }
    const allCollectionId = new mongoose.Types.ObjectId(allCollection._id);

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
    const collectionIdObject = new mongoose.Types.ObjectId(collectionId);
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
    throw error;
  }
}

export async function updateOne (id: string, itemData: Partial<IItem>) {
  try {
    const { user, ...updatedData } = itemData;
    const updatedItem = await Item.findByIdAndUpdate(id, updatedData, { new: true });
    return updatedItem;
  } catch (error) {
    throw error;
  }
}

export async function deleteOne (id:string): Promise<IItem | null> {
  try {
    return Item.findByIdAndDelete(id);
  } catch (error) {
    throw error
  }
}
