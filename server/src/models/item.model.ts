import { IItem } from "../_types";
import { Item } from "./item.schema";
import { addItemToCollection, findCollectionById, findCollectionByName } from "./collection.model";
import { User } from "./user.schema";
import mongoose, { Schema } from "mongoose";
import { Collection } from "./collection.schema";

export async function getAll (id: string): Promise<IItem[] | null> {
  try {
    const items = await Item.find({ user: id }).lean();
    return items;
  } catch (error) {
    throw error;
  }
}
export async function findItemById (id: string): Promise<IItem | null> {
  try {
    return await Item.findById(id).lean();
  } catch (error) {
    throw error;
  }
}

export async function createOne (userId: string, itemData: Partial<IItem>): Promise<IItem | null> {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }

    const allCollection = await findCollectionByName('All');
    const allCollectionId = allCollection?._id;

    if (!allCollection) {
      throw new Error('Could not find the "All" collection.');
    }

    const newItem = new Item({
      user: userId,
      collections: [...(itemData.collections || []), allCollectionId],
      ...itemData,
    });

    return newItem.save().then(savedItem => {
      const itemId = savedItem._id;
      addItemToCollection(allCollectionId, itemId)
    })
    .then(() => newItem);
  } catch (error) {
    console.log('model error', error)
    throw error;
  }
}

// export async function findItemsByCollection (collectionId: string): Promise<IItem[] | null> {
//   try {
//     // return only the items from the collection, and only a plain JJS object to reduce load (mongo doc is bigger)
//     const collection = await findCollectionById(collectionId);

//     if (!collection || ! collection.items) return [];
    
//     // Create an array of promises representing the retirieval of an item by id
//     const itemPromises = collection.items.map(itemId => 
//       Item.findById(itemId)
//     );

//     const items = await Promise.all(itemPromises);
//     return items.filter(item => item !== null) as IItem[];
//   } catch (error) {
//     throw error;
//   }
// }

export async function findItemsByCollection(collectionId: string): Promise<IItem[] | null> {
  try {
    // COnvert the collection ID to a objectId type
    const collectionIdObject = new mongoose.Types.ObjectId(collectionId);
   // Use the aggregation pipeline with $lookup to retrieve items for the collection
      const items = await Collection.aggregate([
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
          'items._id': 1,
          'items.name': 1,
          'items.description': 1,
          'items.img_url': 1,
          'items.value': 1,
          'items.lendable': 1,
          'items.available': 1,
        }
      }
    ]);
    
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
