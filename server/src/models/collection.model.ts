import { Types } from 'mongoose';
import { ICollection } from '../types';
import { Collection } from './schemas/collection.schema';
import * as user from './user.model';
import { User } from './schemas/user.schema';
import { findItemById } from './item.model';
import { Item } from './schemas/item.schema';
import * as collectionModel from './collection.model';

export async function createOne (name: string, userId: string, itemIds?: string[]): Promise<ICollection | null> {
  try {
    const newCollection = new Collection({
      name: name,
      items: itemIds || [],
    });

    console.log(newCollection)

    return newCollection.save().then((savedCollection) => {
      const collectionId = savedCollection._id;
      user.addToUserCollection(userId, collectionId);
      if (itemIds && itemIds.length) itemIds.map(item => collectionModel.addItemToCollection(collectionId.toString(), item))
    })
    .then(() => newCollection);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function findCollectionById (id: string): Promise<ICollection | null> {
  try {
    return await Collection.findById(id);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAll (userId: string): Promise<any | null> {
  try {
    const data = await User.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: 'collections',
          localField: 'collections',
          foreignField: '_id',
          as: 'collections'
        }
      },
      { $unwind: '$collections' },
      {
        $lookup: {
          from: 'items',
          localField: 'collections.items',
          foreignField: '_id',
          as: 'items'
        }
      },
      {
        $project: {
          _id: 0,
          'collections._id': 1,
          'collections.name': 1,
          'items': { $slice: ['$items', 4] }
        }
      }
    ]);

    const collections = data.map(item => ({
      _id: item.collections._id,
      name: item.collections.name,
      items: item.items.map((item: any) => ({img_url: item.img_url}))
    }));

    return collections;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addItemToCollection (collectionId: string, itemId: string) {
  try {
    const itemIdObj = new Types.ObjectId(itemId);
    const collection = await Collection.findById(collectionId);
    
    if (collection && collection.items.includes(itemIdObj)) {
      return collection; 
    }

    const collectionIdObj = new Types.ObjectId(collectionId);
    return await Collection.findByIdAndUpdate(collectionIdObj, 
      { $push: { items: itemIdObj }},
      { new: true } )
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function removeItemFromCollection (collectionId: string, itemId: string) {
  try {
    const itemIdObj = new Types.ObjectId(itemId);
    const collectionIdObj = new Types.ObjectId(collectionId);

    return await Collection.findByIdAndUpdate(collectionIdObj, 
      { $pull: { items: itemIdObj } },
      { new: true });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateName (id: string, newName: string) {
  try {
    return await Collection.findByIdAndUpdate(id, 
      {name: newName}, { new: true });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteOne (id:string): Promise<ICollection | null> {
  try {
    const collectionIdObj = new Types.ObjectId(id);
    const collection = await Collection.findById(collectionIdObj).select({ 'items': 1 });
    if (collection) {
      collection.items.forEach(async (itemId) => {
        await Item.findByIdAndUpdate(itemId, {
          $pull: { collections: collectionIdObj }
        })
      })
    };

    return Collection.findByIdAndDelete(id);
  } catch (error) {
    console.error(error);
    throw error
  }
}

export async function getCollectionIdByName (userId: Types.ObjectId, collectionName: string) {
  try {
    const result = await User.aggregate([
      { $match: { _id: userId } },
      {
        $lookup: {
          from: 'collections',
          localField: 'collections',
          foreignField: '_id',
          as: 'collections'
        }
      },
      { $unwind: '$collections' },
      { $match: { 'collections.name': { $eq: collectionName } } },
      { $project: { id: '$collections._id' } }
    ]);
    
    if (result.length) return result[0].id;
    else return null;
  } catch (error) {
    console.error(error);
    throw error;
  } 
}

export async function removeItemsFromCollection (collectionId: string, itemIds: string[]) {
  try {
    const collectionIdObj = new Types.ObjectId(collectionId);
    const itemIdObjArray = itemIds.map((id) => new Types.ObjectId(id));

    for (let item of itemIdObjArray) {
      await Item.findByIdAndUpdate(item, {
        $pull: { collections: collectionIdObj }
      })
    };

    return await Collection.findByIdAndUpdate(collectionIdObj, {
      $pullAll: { items: itemIdObjArray }
    });

  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addItemsToCollections (collectionIds: string[], itemIds: string[]) {
  try {
    console.log('collectionIds', collectionIds)
    console.log('itemIds', itemIds)
    const collectionIdObjArray = collectionIds.map((id) => new Types.ObjectId(id));
    const itemIdObjArray = itemIds.map((id) => new Types.ObjectId(id));
    console.log('collectionIdObjArray', collectionIdObjArray)
    console.log('itemIdObjArray', itemIdObjArray)

    for (let item of itemIdObjArray) {
      await Item.findByIdAndUpdate(item, {
        $addToSet: { collections: { $each: collectionIdObjArray } }
      }, { new: true });
    };

    for (let collection of collectionIdObjArray) {
      await Collection.findByIdAndUpdate(collection, {
        $addToSet: { items: { $each: itemIdObjArray } }
      }, { new: true });
    };

    return { collectionIdObjArray, itemIdObjArray };
    
    } catch (error) {
    console.error(error);
    throw error;
  }
}