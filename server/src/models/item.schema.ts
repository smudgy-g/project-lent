import { Schema, model, Document } from 'mongoose';
import { IItem } from '../_types';


// Schema for the user
const itemSchema = new Schema<IItem>({
  user: { type: String, required: true, unique: true }, // user._id
  name: { type: String, required: true },
  photo: { type: String }, // URL to cloudinary link
  value: { type: Number },
  description: { type: String, required: true },
  lendable: { type: Boolean },
  available: { type: Boolean },
  collections: { type: [String] },
}, { timestamps: true });

// Create model from schema
export const Item = model<IItem>('Item', itemSchema);
