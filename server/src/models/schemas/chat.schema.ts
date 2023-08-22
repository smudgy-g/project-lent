import { Schema, model } from 'mongoose';
import { IChat } from '../../types';

const chatSchema = new Schema<IChat>(
  {
    item: { type: Schema.Types.ObjectId, ref: 'Item' },
    messages: { type: [Schema.Types.ObjectId], ref: 'Message' },
    users: { type: [Schema.Types.ObjectId], ref: 'User'}
  },
  { timestamps: true }
);

export const Chat = model<IChat>('Chat', chatSchema);
