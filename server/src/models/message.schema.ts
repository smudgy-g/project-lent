import { Schema, model } from 'mongoose';
import { IMessage } from '../_types';

// Schema for the user
const messageSchema = new Schema<IMessage>(
  {
    body: { type: String, required: true }, // user._id
    from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // URL to cloudinary link
    seen: { type: Boolean },
  },
  { timestamps: true }
);

// Create model from schema
export const Message = model<IMessage>('Message', messageSchema);
