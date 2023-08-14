import { IItem, INewItem } from "../_types";
import { Item } from "./item.schema";

export async function getAll (id: string): Promise<IItem[] | null> {
  try {
    const items = await Item.find({ user: id });
    return items;
  } catch (error) {
    throw error;
  }
}

export async function createOne (
  userId: string, itemData: INewItem
  ): Promise<IItem | null> {
  try {
    const newItem = await Item.create({
      user: userId,
      collections: [],
      ...itemData
    });
    return newItem.save();
  } catch (error) {
    throw error;
  }
}

// export async function findCollectionById (id:string) {
//   try {
//     return await Collection.findById(id);
//   } catch (error) {
//     throw error;
//   }
// }



// export async function updateName (id: string, newName: string) {
//   try {
//     return await Collection.findByIdAndUpdate(id, 
//       {name: newName});
//   } catch (error) {
//     throw error;
//   }
// }

// export async function deleteOne (id:string): Promise<ICollection | null> {
//   try {
//     return Collection.findByIdAndDelete(id);
//   } catch (error) {
//     throw error
//   }
// }
