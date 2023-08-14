import { IItem } from "../_types";
import { Item } from "./item.schema";
import { addItemToCollection, findCollectionById, findCollectionByName } from "./collection.model";

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

export async function createOne(userId: string, itemData: Partial<IItem>): Promise<IItem | null> {
  try {
    const allCollection = await findCollectionByName('All');
    const allCollectionId = allCollection?._id.toString();

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
    throw error;
  }
}

export async function findItemsByCollection (collectionId: string): Promise<IItem[] | null> {
  try {
    // return only the items from the collection, and only a plain JJS object to reduce load (mongo doc is bigger)
    const collection = await findCollectionById(collectionId);

    if (!collection || ! collection.items) return [];
    
    // Create an array of promises representing the retirieval of an item by id
    const itemPromises = collection.items.map(itemId => 
      Item.findById(itemId)
    );

    const items = await Promise.all(itemPromises);
    return items.filter(item => item !== null) as IItem[];
  } catch (error) {
    throw error;
  }
}


export async function updateOne (id: string, itemData: Partial<IItem>) {
  try {
    const { collections, user, ...updatedData } = itemData;
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
