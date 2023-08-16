import mongoose from 'mongoose';
import { IAddress, IUser } from '../_types';
import convertAddressToGeoCode from '../helpers/geocoding';
import * as collection from './collection.model';
import { User } from './user.schema';
import bcrypt from 'bcrypt';

export async function createUser (
  username: string,
  email: string,
  password: string,
  address: IAddress
): Promise<IUser> {
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
    });
    return newUser.save().then(async (user) => {
      const id = user._id;
      await collection.createOne('All', id);
      await collection.createOne('Borrowed', id);
      await collection.createOne('Lent Out', id);
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
    const collectionIdObject = new mongoose.Types.ObjectId(collectionId);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { collections: collectionIdObject } },
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
    const userIdObject = new mongoose.Types.ObjectId(userId);
    return await User.findByIdAndDelete(userIdObject);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function checkEmailUsernameExist(email: string, username: string) {
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return { message: 'Email already exists.' };
  }

  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return { message: 'Username already exists.' };
  }

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
