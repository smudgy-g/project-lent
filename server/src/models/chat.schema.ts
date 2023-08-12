import { Schema, model, Document } from 'mongoose';

export interface IChat extends Document {
  item: string; // item._id
  messages: string[];
}

// Schema for the collection
const chatSchema = new Schema<IChat>(
  {
    item: { type: String, required: true }, // item._id
    messages: { type: [String] },
  },
  { timestamps: true }
);

// Create model from schema
export const Chat = model<IChat>('Chat', chatSchema);
