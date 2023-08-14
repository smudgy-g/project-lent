import { ICollection, Collection } from './collection.schema';
import { IUser } from './user.schema';
import { findUserById, addToUserCollection } from './user.model';

export async function createOne (name: string, userId: string): Promise<ICollection | null> {
  try {
    const newCollection = new Collection({
    // const newCollection = await Collection.create({
      name: name.toLowerCase(),
      items: [],
    });
    newCollection.save().then((savedCollection) => {
      const collectionId = savedCollection._id;
      // update user ccollections arrray
      addToUserCollection(userId, collectionId);

      // Return the newly created collection
    }).then(() => newCollection)
    return newCollection;
  } catch (error) {
    throw error;
  }
}

export async function findCollectionById (id:string) {
  try {
    return await Collection.findById(id);
  } catch (error) {
    throw error;
  }
}


export async function getAllCollections (id: string): Promise<any | null> {
  try {
    const { collections } = (await findUserById(id)) as IUser;
    return collections;
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
