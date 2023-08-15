import { Document, Schema } from 'mongoose';

export interface IItem extends Document {
  user: Schema.Types.ObjectId; // user._id
  name: string;
  photo?: string; // URL to cloudinary link
  value?: number;
  description: string;
  lendable: boolean;
  available: boolean;
  collections: string[];
  borrowed: boolean;
}

export interface ILogin {
  username: string;
  password: string;
}

export interface IChat extends Document {
  item: Schema.Types.ObjectId; // item._id
  messages: Schema.Types.ObjectId[];
}

export interface IMessage extends Document {
  body: string;
  from: Schema.Types.ObjectId; // A user._id
  to: Schema.Types.ObjectId; // B user._id
  seen: boolean;
}

export interface ICollection extends Document {
  name: string;
  items: Schema.Types.ObjectId[]; // item._id
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string; // hashed
  address: IAddress;
  geoLocation: IGeoLocation; // or stored geo-location
  credits: number;
  reputation: number;
  collections: Schema.Types.ObjectId[]; // collection._id
  inbox: Schema.Types.ObjectId[]; // chat._id
}

export interface IGeoLocation {
  lat: number;
  lng: number;
}

export interface IAddress {
  streetName: string;
  streetNumber: string;
  postalCode: string;
  city: string;
}