import { Schema, model } from 'mongoose';
import { IItem } from '../../types';

const itemSchema = new Schema<IItem>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  img_url: { type: String },
  value: { type: Number },
  description: { type: String, required: true },
  lendable: { type: Boolean },
  available: { type: Boolean },
  collections: [{ type: Schema.Types.ObjectId, ref: 'Collection' }],
  borrowed: { type: Boolean }
}, { timestamps: true });

// remove unique index on the user field
itemSchema.index({ user: 1 }, { unique: false });

// Create a text index on the name field for searching
itemSchema.index({name: 'text'});

export const Item = model<IItem>('Item', itemSchema);
