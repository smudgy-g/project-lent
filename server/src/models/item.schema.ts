import { Schema, model, Document } from 'mongoose';

export interface IItem extends Document {
  user: string; // user._id
  name: string;
  photo?: string; // URL to cloudinary link
  value: number;
  description: string;
  lendable: boolean;
  available: boolean;
  collections: string[];
}

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
});

// Create model from schema
export const Item = model<IItem>('Item', itemSchema);
