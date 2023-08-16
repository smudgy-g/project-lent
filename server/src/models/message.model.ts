import { IMessage } from "../_types";
import { Message } from "./message.schema";
import { User } from "./user.schema";

export async function postMessage (message: IMessage): Promise<IMessage | null> {
  try {
    const newMessage = await Message.create({
      body: message.body,
      from: message.from,
      to: message.to,
      seen: message.seen,
    });
    
    // need the chatid to update the
    await Chat.findByIdAndUpdate(**chatid**, {
      $push: {
        messages: {
          $each: newMessage._id
        }
      }
    });

    return newMessage;
  } catch (error) {
    console.error(error);
    throw error
  }
}