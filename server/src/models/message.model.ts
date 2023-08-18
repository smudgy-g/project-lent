import { Types } from "mongoose";
import { IMessage } from "../types";
import { Message } from "./schemas/message.schema";
import { Chat } from "./schemas/chat.schema";

export async function postMessage (message: IMessage, chatId: string) {
  try {
    const newMessage = await Message.create({
      body: message.body,
      from: message.from,
      to: message.to,
      seen: message.seen,
    });
    // Push new message into the chat document
    const chatIdObject = new Types.ObjectId(chatId);
    return await Chat.findByIdAndUpdate(chatIdObject, {
      $push: {
        messages: newMessage._id
      }
    }, { new: true } );
  } catch (error) {
    console.error(error);
    throw error
  }
}