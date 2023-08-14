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
      await collection.createOne('Borrowed', id);
      await collection.createOne('Lent Out', id);
    })
    .then(() => newUser);
  } catch (err) {
    throw err;
  }
}

export async function findUserById (id: string): Promise<IUser | null> {
  try {
    return await User.findById(id).lean();
  } catch (err) {
    throw err;
  }
}
export async function findUserByEmail (email: string): Promise<IUser | null> {
  try {
    return await User.findOne({ email }).lean();
  } catch (err) {
    throw err;
  }
}

export async function findUserByUsername (
  username: string
): Promise<IUser | null> {
  try {
    return await User.findOne({ username }).lean();
  } catch (err) {
    throw err;
  }
}

export async function addToUserCollection (userId: string, collectionId: string): Promise<any> {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { collections: collectionId } }
    );
    return updatedUser;
  } catch (err) {
    throw err;
  }
}

export async function deleteUserById (userId: string): Promise<IUser | null> {
  try {
    return await User.findByIdAndDelete({ userId });
  } catch (err) {
    throw err;
  }
}
