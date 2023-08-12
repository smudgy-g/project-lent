import { convertAddressToGeoCode } from "../middleware/geocoding";
import { IUser, IAddress, User } from "./user.schema";

export async function createUser(
  username: string,
  email: string,
  password: string,
  address: IAddress,
): Promise<IUser> {
  try {
    const geoLocation = convertAddressToGeoCode(address);
    const user = new User({
      username,
      email,
      password,
      address,
      geoLocation,
      credits: 0,
      reputation: 0,
      collections: ['all', 'borrowed', 'lent out'],
      inbox: ['']
    });
    console.log(user);
    return await user.save();
  } catch (err) {
    throw err;
  }
};
