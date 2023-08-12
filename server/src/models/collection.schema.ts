import { Schema, model, Document } from 'mongoose';

export interface ICollection extends Document {
  name: string;
  items: string[]; // item._id
}

// Schema for the collection
const collectionSchema = new Schema<ICollection>({
  name: String,
  items: [String], // item._id
});

// Create model from schema
export const Collection = model<ICollection>('Collection', collectionSchema);
