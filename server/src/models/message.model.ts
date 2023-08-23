import { Types } from "mongoose";
import { IMessage } from "../types";
import { Message } from "./schemas/message.schema";
import { Chat } from "./schemas/chat.schema";

export async function postMessage (message: IMessage, chatId: string) {
  let newMessage: Partial<IMessage>;
  if (!message.body) {
    console.log('No message body provided.');
    return message;
  }
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

    return newNotification;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateMessage (message: Partial<IMessage>, messageId: string) {
  // object with message id and from/to/notification property
  const messageIdObj = new Types.ObjectId(messageId);
  try {
    if (message.from) {
      return await Message.findByIdAndUpdate(messageIdObj, {
        $set: { 'from.seen': Boolean(message.from.seen) }
      }, { new: true })
    }

    if (message.to) {
      return await Message.findByIdAndUpdate(messageIdObj, {
        $set: { 'to.seen': Boolean(message.to.seen) }
      }, { new: true })
    }

    if (message.notification) {
      return await Message.findByIdAndUpdate(messageIdObj, {
        $set: { 'notification.seen': Boolean(message.notification.seen) }
      }, { new: true })
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}