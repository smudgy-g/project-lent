import mongoose from "mongoose";
import { IChat } from "../_types";
import { Chat } from "./chat.schema";
import { User } from "./user.schema";

export async function deleteOne (id:string): Promise<IChat | null> {
  try {
    return Chat.findByIdAndDelete(id);
  } catch (error) {
    throw error
  }
}

export async function getAllChats (userId:string): Promise<Partial<IChat>[] | null> {
  try {
    const data = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: 'chats',
          localField: 'inbox',
          foreignField: '_id',
          as: 'chats'
        }
      },
      { $unwind: '$chats'},
      {
        $lookup: {
          from: 'items',
          localField: 'chats.item',
          foreignField: '_id',
          as: 'item'
        }
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'chats.messages',
          foreignField: '_id',
          as: 'messages'
        }
      },
      {
        $project: {
          _id: 0,
          'chats._id': 1,
          'chats.item': 1,
          'item.name': 1,
          'messages.body': 1,
          'chats.updatedAt': 1
        }
      }
    ])
    const chats = data.map(chat => ({
      id: chat.chats._id,
      itemId: chat.chats.item,
      itemName: chat.item[0].name,
      message: chat.messages[0].body,
      updatedAt: chat.chats.updatedAt
    }));
    return chats;
  } catch (error) {
    throw error
  }
  // return array
  /* 
  {
    id:
    itemId:
    itemName:
    message:
    foreignUser:
    updatedAt:
  }
  */
}