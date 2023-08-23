import { Schema, model } from 'mongoose';
import { IMessage } from '../../types';

const messageSchema = new Schema<IMessage>(
  {
    body: { type: String, required: true },
    notification: {
      item: { type: String},
      seen: { type: Boolean }
    },
    from: { 
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      seen: { type: Boolean }
    },
    to: { 
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      seen: { type: Boolean } 
    },
  },
  { timestamps: true }
);

export const Message = model<IMessage>('Message', messageSchema);
