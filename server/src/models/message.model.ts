import mongoose from "mongoose";
import { IMessage } from "../_types";
import { Message } from "./message.schema";
import { Chat } from "./chat.schema";

export async function postMessage (message: IMessage, chatId: string): Promise<IMessage | null> {
  try {
    const newMessage = await Message.create({
      body: message.body,
      from: message.from,
      to: message.to,
      seen: message.seen,
    });

    // Push new message into the chat document
    const chatIdObject = new mongoose.Types.ObjectId(chatId);
    await Chat.findByIdAndUpdate(chatIdObject, {
      $push: {
        messages: newMessage._id
      }
    });

    return newMessage;
  } catch (error) {
    console.error(error);
    throw error
  }
}