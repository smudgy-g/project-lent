import mongoose, { Schema, SchemaType, Types } from "mongoose";
import { IChat, IMessage } from "../types";
import { Chat } from "./schemas/chat.schema";
import { User } from "./schemas/user.schema";
import { getUsername } from "./user.model";
import { postMessage } from '../models/message.model';

export async function deleteOne (id:string): Promise<IChat | null> {
  try {
    const chatIdObject = new Types.ObjectId(id);
    return Chat.findByIdAndDelete(chatIdObject);
  } catch (error) {
    console.error(error);
    throw error
  }
}

export async function getAllChats (userId:string): Promise<any[] | null> {
  try {
    const data = await User.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(userId)
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
        const foreignUserName = await Promise.all(
        chat.chats.users
          .filter((user: any) => user._id.toString() !== userId)
          .map(async (user: any) => await getUsername(user.toString()))
      );

        return {
          id: chat.chats._id,
          itemId: chat.chats.item,
          itemName: chat.item[0].name,
          foreignUser: foreignUserName[0],
          message: chat.messages[chat.messages.length - 1].body,
          updatedAt: chat.chats.updatedAt,
        };
      })
    );
    return chats;
  } catch (error) {
    console.error(error);
    console.error(error);
    throw error
  }
}

export async function getChatById (chatId: string, userId: string): Promise<any | null> {
  try {
    const chatIdObject = new Types.ObjectId(chatId);
    
    const data = await Chat.aggregate([
      // Use the objectId to find the chat
      {
        $match: {
          _id: chatIdObject
        }
      },
      // Get the messages in the chat using the message._id and return as 'messages'
      {
        $lookup: {
          from: 'messages',
          localField: 'messages',
          foreignField: '_id',
          as: 'messages'
        }
      },
      // Get the item related to the chat using the item._id and return it as 'item'
      {
        $lookup: {
          from: 'items',
          localField: 'item',
          foreignField: '_id',
          as: 'item',
        },
      },
      // Sculpt the data to return to the front-end
      {
        $project: {
          _id: 1,
          users: 1,
          'item._id': 1,
          'item.name': 1,
          'item.user': 1,
          messages: {
            // For each message map each message to the output we need. $$message references the "as: 'message'".
            $map: {
              input: '$messages',
              as: 'message', 
              in: {
                body: '$$message.body',
                from: '$$message.from',
                to: '$$message.to',
                seen: '$$message.seen',
                createdAt: '$$message.createdAt',
              },
            },
          },
        },
      },
    ]);

    const result: any = await (async () => {
      const foreignUserName = await Promise.all(
        data[0].users
          .filter((user: any) => user._id.toString() !== userId)
          .map(async (user: any) => await getUsername(user.toString()))
      );

      const foreignUserId = data[0].users.filter((user: any) => user._id.toString() !== userId)

      return {
        _id: data[0]._id,
        users: data[0].users,
        foreignUserName: foreignUserName[0],
        foreignUserId: foreignUserId[0],
        item: data[0].item[0],
        messages: data[0].messages
          .map((message: any) => ({
            from: message.from,
            to: message.to,
            body: message.body,
            seen: message.seen,
            createdAt: message.createdAt
          }))
          .sort((a: any, b: any) => b.createdAt - a.createdAt)
      };
    })();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createChat (itemId: string, ownerId: any, userId: string, message?: string): Promise<IChat | null> {
  try {
    const ownerIdObject = new Types.ObjectId(ownerId);
    const userIdObject = new Types.ObjectId(userId);
    const itemIdObject = new Types.ObjectId(itemId);

    const newChatData: Partial<IChat> = new Chat({
      item: itemIdObject,
      users: [ownerIdObject, userIdObject]
    });

    const newChat = await Chat.create(newChatData);

    if (message) {
      const newMessage = {
        body: message,
        from: userIdObject,
        to: ownerIdObject,
        seen: false
      }
      await postMessage(newMessage as IMessage, newChat._id);
      return Chat.findById(newChat._id)
    }
    return newChat;
  } catch (error) {
    console.error(error);
    throw error
  }
}