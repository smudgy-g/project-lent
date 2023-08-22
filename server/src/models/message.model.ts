import { Types } from "mongoose";
import { IMessage } from "../types";
import { Message } from "./schemas/message.schema";
import { Chat } from "./schemas/chat.schema";

export async function postMessage (message: IMessage, chatId: string) {
  try {
    const chatIdObj = new Types.ObjectId(chatId);
    const newMessage = await Message.create({
      body: message.body,
      from: { user: message.from, seen: true },
      to: { user: message.to, seen: false },
    });
    return await Chat.findByIdAndUpdate(chatIdObj, {
      $push: {
        messages: newMessage._id
      }
    }, { new: true } );
  } catch (error) {
    console.error(error);
    throw error;
  }
}