import convertAddressToGeoCode from '../helpers/geocoding';
import { IUser, IAddress, User } from './user.schema';
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

    const user = new User({
      username,
      email,
      password: hashedPassword,
      address,
      geoLocation,  
      credits: 0,
      reputation: 0,
      collections: ['borrowed', 'lent out'],
      inbox: [''],
    });
    return await user.save();
  } catch (err) {
    throw err;
  }
}

export async function findUserById (id: string): Promise<IUser | null> {
  try {
    return await User.findById(id);
  } catch (err) {
    throw err;
  }
}
export async function findUserByEmail (email: string): Promise<IUser | null> {
  try {
    return await User.findOne({ email });
  } catch (err) {
    throw err;
  }
}

export async function findUserByUsername (
  username: string
): Promise<IUser | null> {
  try {
    return await User.findOne({ username });
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
