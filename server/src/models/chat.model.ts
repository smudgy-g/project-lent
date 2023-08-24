import { Types } from "mongoose";
import { IChat, IMessage } from "../types";
import { Chat } from "./schemas/chat.schema";
import { User } from "./schemas/user.schema";
import { addChatToInbox, getUsername } from "./user.model";
import { postMessage } from '../models/message.model';

export async function deleteOne (id:string): Promise<IChat | null> {
  try {
    const chatIdObj = new Types.ObjectId(id);
    return Chat.findByIdAndDelete(chatIdObj);
  } catch (error) {
    console.error(error);
    throw error
  }
}

export async function getAllChats (userId:string): Promise<any[] | null> {
  try {
    const data = await User.aggregate([
      { $match: {  _id: new Types.ObjectId(userId) } },
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
          _id: 1,
          'chats._id': 1,
          'chats.item': 1,
          'chats.users': 1,
          'item.name': 1,
          'item.img_url': 1,
          'messages': 1,
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
          itemName: chat.item[0] ? chat.item[0].name : '',
          img_url: chat.item[0] ? chat.item[0].img_url : '',
          foreignUser: foreignUserName[0],
          messages: chat.messages,
          updatedAt: chat.chats.updatedAt,
        };
      })
    );
    return chats;
  } catch (error) {
    console.error(error);
    throw error
  }
}

export async function getChatById (chatId: string, userId: string): Promise<any | null> {
  try {
    const chatIdObj = new Types.ObjectId(chatId);

    const data = await Chat.aggregate([
      { $match: { _id: chatIdObj } },
      {
        $lookup: {
          from: 'messages',
          localField: 'messages',
          foreignField: '_id',
          as: 'messages'
        }
      },
      {
        $lookup: {
          from: 'items',
          localField: 'item',
          foreignField: '_id',
          as: 'item',
        },
      },
      {
        $project: {
          _id: 1,
          users: 1,
          'item._id': 1,
          'item.name': 1,
          'item.user': 1,
          messages: {
            $map: {
              input: '$messages',
              as: 'message',
              in: {
                _id: '$$message._id',
                notification: '$$message.notification',
                body: '$$message.body',
                from: '$$message.from',
                to: '$$message.to',
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
            id: message._id,
            notification: message.notification,
            from: message.from,
            to: message.to,
            body: message.body,
            createdAt: message.createdAt
          }))
          .sort((a: any, b: any) => b.createdAt - a.createdAt)
      };
    })();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createNotificationChat (id: Types.ObjectId): Promise<IChat | null> {
  try {
    const newChatData = new Chat({ _id: id });
    return await Chat.create(newChatData);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createChat (itemId: string, ownerId: string, userId: string, message?: string): Promise<IChat | null> {
  try {
    const ownerIdObj = new Types.ObjectId(ownerId);
    const userIdObj = new Types.ObjectId(userId);
    const itemIdObj = new Types.ObjectId(itemId);

    const newChatData = new Chat({
      item: itemIdObj,
      users: [ownerIdObj, userIdObj]
    });

    const newChat = await Chat.create(newChatData);

    if (message) {
      const newMessage = {
        body: message,
        from: {
          user: userIdObj,
          seen: false
        },
        to: {
          user: ownerIdObj,
          seen: false
        },
      }
      await addChatToInbox(ownerIdObj, newChat._id);
      await addChatToInbox(userIdObj, newChat._id);
      await postMessage(newMessage as IMessage, newChat._id);
    }
    return newChat;
  } catch (error) {
    console.error(error);
    throw error;
  }
}