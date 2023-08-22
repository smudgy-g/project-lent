import { Schema, model } from 'mongoose';
import { ICollection } from '../../types';

const collectionSchema = new Schema<ICollection>({
  name: { type: String, required: true },
  items: [{ type: Schema.Types.ObjectId, ref: 'Item', required: true }],
}, { timestamps: true });

export const Collection = model<ICollection>('Collection', collectionSchema);
