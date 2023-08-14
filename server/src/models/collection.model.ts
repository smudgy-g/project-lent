import { ICollection, IUser } from '../_types';
import { Collection } from './collection.schema';
import * as user from './user.model';

export async function createOne (name: string, userId: string): Promise<ICollection | null> {
  try {
    const newCollection = new Collection({
      name: name,
      items: [],
    });
    return newCollection.save().then((savedCollection) => {
      const collectionId = savedCollection._id;
      // update user collections array
      user.addToUserCollection(userId, collectionId);

      // Return the newly created collection
    })
    .then(() => newCollection);
  } catch (error) {
    throw error;
  }
}

export async function findCollectionById (id: string): Promise<ICollection | null> {
  try {
    return await Collection.findById(id);
  } catch (error) {
    throw error;
  }
}

export async function findCollectionByName (name: string): Promise<ICollection | null> {
  try {
    return await Collection.findOne({ name }).lean();
  } catch (error) {
    throw error;
  }
}


export async function getAll (userId: string): Promise<any | null> {
  try {
    const { collections } = (await user.findUserById(userId)) as IUser;
    return collections;
  } catch (error) {
    throw error;
  }
}

export async function addItemToCollection (collectionId: string, itemId: string) {
  try {
    return await Collection.findByIdAndUpdate(collectionId, 
      { $push: { items: itemId }},
      { new: true } )
  } catch (error) {
    throw error;
  }
}

export async function updateName (id: string, newName: string) {
  try {
    return await Collection.findByIdAndUpdate(id, 
      {name: newName}, { new: true });
  } catch (error) {
    throw error;
  }
}

export async function deleteOne (id:string): Promise<ICollection | null> {
  try {
    return Collection.findByIdAndDelete(id);
  } catch (error) {
    throw error
  }
}
