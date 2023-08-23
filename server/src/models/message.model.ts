import { Types } from "mongoose";
import { IMessage } from "../types";
import { Message } from "./schemas/message.schema";
import { Chat } from "./schemas/chat.schema";

export async function postMessage (message: IMessage, chatId: string) {
  let newMessage: Partial<IMessage>;
  try {
    const chatIdObj = new Types.ObjectId(chatId);
    if (!message.from || !message.to) {
      newMessage = await Message.create({
      body: message.body
      });
    } else {
      newMessage = await Message.create({
        body: message.body,
        from: { user: message.from.user, seen: true },
        to: { user: message.to.user, seen: false },
      });
    }
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

export async function postNotification (message: string, itemId: string, chatId: Types.ObjectId) {
  try {
  
  const notification: Partial<IMessage> = {
    body: message,
    notification: {
      item: itemId,
      seen: false
    }
  }
  const newNotification = await Message.create(notification);
  console.log(newNotification);
  const res = await Chat.findByIdAndUpdate(chatId, { $push: { messages: newNotification._id } });
  console.log(res);
  return res;

  return newNotification;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
