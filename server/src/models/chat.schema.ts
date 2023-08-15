import { Schema, model } from 'mongoose';
import { IChat } from '../_types';

const chatSchema = new Schema<IChat>(
  {
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true }, // item._id
    messages: { type: [Schema.Types.ObjectId], ref: 'Message' },
  },
  { timestamps: true }
);

export const Chat = model<IChat>('Chat', chatSchema);
