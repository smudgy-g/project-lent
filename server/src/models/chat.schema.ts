import { Schema, model } from 'mongoose';
import { IChat } from '../_types';

// Schema for the collection
const chatSchema = new Schema<IChat>(
  {
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true }, // item._id
    messages: { type: [Schema.Types.ObjectId], ref: 'Chat' },
  },
  { timestamps: true }
);

// Create model from schema
export const Chat = model<IChat>('Chat', chatSchema);
