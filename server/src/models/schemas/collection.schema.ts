import { Schema, model } from 'mongoose';
import { ICollection } from '../../types';

// Schema for the collection
const collectionSchema = new Schema<ICollection>({
  name: { type: String, required: true },
  items: [{ type: Schema.Types.ObjectId, ref: 'Item', required: true }], // item._id
}, { timestamps: true });

// Create model from schema
export const Collection = model<ICollection>('Collection', collectionSchema);
