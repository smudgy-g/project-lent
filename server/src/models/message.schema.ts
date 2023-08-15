import { Schema, model } from 'mongoose';
import { IMessage } from '../_types';

const messageSchema = new Schema<IMessage>(
  {
    body: { type: String, required: true },
    from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seen: { type: Boolean },
  },
  { timestamps: true }
);

export const Message = model<IMessage>('Message', messageSchema);
