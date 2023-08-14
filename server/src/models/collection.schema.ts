import { Schema, model } from 'mongoose';
import { ICollection } from '../_types';

// Schema for the collection
const collectionSchema = new Schema<ICollection>({
  name: String,
  items: [String], // item._id
}, { timestamps: true });

// Create model from schema
export const Collection = model<ICollection>('Collection', collectionSchema);
