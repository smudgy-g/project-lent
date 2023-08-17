import { Types } from 'mongoose';
import { ICollection } from '../types';
import { Collection } from './schemas/collection.schema';
import * as user from './user.model';
import { User } from './user.schema';

export async function createOne (name: string, userId: string): Promise<ICollection | null> {
  try {
    const newCollection = new Collection({
      name: name,
      items: [],
    });
    return newCollection.save().then((savedCollection) => {
      const collectionId = savedCollection._id;
      user.addToUserCollection(userId, collectionId);
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

export async function findCollectionByName (name: string): Promise<ICollection | null> {
  try {
    return await Collection.findOne({ name });
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
    const itemIdObject = new Types.ObjectId(itemId);

    return await Collection.findByIdAndUpdate(collectionId, 
      { $push: { items: itemIdObject }},
      { new: true } )
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
    return Collection.findByIdAndDelete(id);
  } catch (error) {
    console.error(error);
    throw error
  }
}
