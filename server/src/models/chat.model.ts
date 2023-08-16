import mongoose from "mongoose";
import { IChat } from "../_types";
import { Chat } from "./chat.schema";
import { User } from "./user.schema";
import { getUsername } from "./user.model";

export async function deleteOne (id:string): Promise<IChat | null> {
  try {
    const chatIdObject = new mongoose.Types.ObjectId(id);
    return Chat.findByIdAndDelete(chatIdObject);
  } catch (error) {
    throw error
  }
}

export async function getAllChats (userId:string): Promise<any[] | null> {
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
          'chats.users': 1,
          'item.name': 1,
          'messages.body': 1,
          'chats.updatedAt': 1
        }
      }
    ])

    const chats = await Promise.all(
      data.map(async (chat) => {
        const foreignUsers = await Promise.all(
        chat.chats.users
          .filter((user: any) => user._id.toString() !== userId)
          .map(async (user: any) => await getUsername(user.toString()))
      );

        return {
          id: chat.chats._id,
          itemId: chat.chats.item,
          itemName: chat.item[0].name,
          foreignUser: foreignUsers[0],
          message: chat.messages[0].body,
          updatedAt: chat.chats.updatedAt,
        };
      })
    );
    console.log(chats)
    return chats;
  } catch (error) {
    throw error
  }
}

export async function getChatById (chatId: string) {
  try {
    const chatIdObject = new mongoose.Types.ObjectId(chatId);
    const data = await Chat.aggregate([
      {
        $match: {
          _id: chatIdObject
        }
      },
      // {
      //   $lookup: {

      //   }
      // }
    ]);
    /* 
    {
      _id: chat id
      itemId:
      itemName:
      messages: [
        message object1,
        message oobject2
      ]
      users: [
        userId1,
        userId2
      ]
    }
    */
    console.log(data);
  } catch (error) {
    
  }
}