import { Schema, model, Document } from 'mongoose';

export interface IMessage extends Document {
  body: string;
  from: string; // A user._id
  to: string; // B user._id
  seen: boolean;
}

// Schema for the user
const messageSchema = new Schema<IMessage>(
  {
    body: { type: String, required: true }, // user._id
    from: { type: String, required: true },
    to: { type: String, required: true }, // URL to cloudinary link
    seen: { type: Boolean },
  },
  { timestamps: true }
);

// Create model from schema
export const Message = model<IMessage>('Message', messageSchema);
