import { Types } from 'mongoose';
import { IAddress, IGeoLocation, IUser } from '../types';
import convertAddressToGeoCode from '../utilities/geocoding';
import * as collection from './collection.model';
import { User } from './schemas/user.schema';
import bcrypt from 'bcrypt';

export async function createUser (username: string, email: string, password: string, address: IAddress): Promise<IUser> {
  try {
    const geoLocation = await convertAddressToGeoCode(address);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      address,
      geoLocation,  
      credits: 0,
      reputation: 0,
      collections: [],
      inbox: [],
      new: true
    });
    
    return newUser.save().then(async (user) => {
      const id = user._id;
      await collection.createOne('All', id);
      await collection.createOne('Borrowed', id);
      await collection.createOne('Lent Out', id);
      await collection.createOne('Reserved', id);
    })
    .then(() => newUser);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function findUserById (id: string): Promise<IUser | null> {
  try {
    return await User.findById(id);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addToUserCollection (userId: string, collectionId: string): Promise<any> {
  try {
    const collectionIdObj = new Types.ObjectId(collectionId);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { collections: collectionIdObj } },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateUserDetails (id: string, { username, email, address }:Partial<IUser>): Promise<IUser | null> {
  try {
    const geoLocation = await convertAddressToGeoCode(address!);    
    const updatedUser = await User.findByIdAndUpdate(id,
      {
        username,
        email, 
        address, 
        geoLocation 
      }, { new: true });
    return updatedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteUserById (userId: string): Promise<IUser | null> {
  try {
    const userIdObj = new Types.ObjectId(userId);
    return await User.findByIdAndDelete(userIdObj);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserGeoLocation(userId: Types.ObjectId) {
  const user = await User.findById(userId);
  if (user) return user.geoLocation;
  return null;
}

export async function findUserByUsername(username:string) {
   return await User.findOne({ username });
}

export async function findUserByEmail(email:string) {
   return await User.findOne({ email });
}

export async function getUsername (userId: string) {
  const user = await User.findById(userId);
  if (user) return user.username;
  else return null;
}

export async function addChatToInbox (userId: Types.ObjectId, chatId: Types.ObjectId) {
  try {
    const userIdObj = new Types.ObjectId(userId);
    const chatIdObj = new Types.ObjectId(chatId);

    return await User.findByIdAndUpdate(userIdObj, {
      $push: {
        inbox: chatIdObj
      }
    }, { new: true } )
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function transferValue (to: Types.ObjectId, from: Types.ObjectId, value: number) {
  try {
    const fromUser = await User.findById(from).select({ 'credits': 1 });

    if (fromUser && fromUser.credits >= value) {
      await User.findByIdAndUpdate(from, { $inc: {credits: -value }});
      await User.findByIdAndUpdate(to, { $inc: {credits: +value }});
      
      return value;
    } 
    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function changeCredits (userId: Types.ObjectId, value: number) {
  try {
    await User.findByIdAndUpdate(userId, { $inc: {credits: value }});
  } catch (error) {
    console.error(error);
    throw error;
  }
}