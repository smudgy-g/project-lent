import { Document } from 'mongoose';

export interface IItem extends Document {
  user: string; // user._id
  name: string;
  photo?: string; // URL to cloudinary link
  value?: number;
  description: string;
  lendable: boolean;
  available: boolean;
  collections: string[];
}

export interface INewItem {
  name: string;
  photo?: string; // URL to cloudinary link
  value?: number;
  description: string;
  lendable: boolean;
  available: boolean;
}

export interface ILogin {
  username: string;
  password: string;
}

export interface IChat extends Document {
  item: string; // item._id
  messages: string[];
}

export interface IMessage extends Document {
  body: string;
  from: string; // A user._id
  to: string; // B user._id
  seen: boolean;
}

export interface ICollection extends Document {
  name: string;
  items: string[]; // item._id
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string; // hashed
  address: IAddress;
  geoLocation: IGeoLocation; // or stored geo-location
  credits: number;
  reputation: number;
  collections: string[]; // collection._id
  inbox: string[]; // chat._id
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