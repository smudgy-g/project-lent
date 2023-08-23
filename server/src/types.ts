import { Document, Types } from 'mongoose';

export interface IItem extends Document {
  user: Types.ObjectId; 
  name: string;
  img_url?: string;
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
  item?: Types.ObjectId;
  messages: Types.ObjectId[];
  users?: Types.ObjectId[];
}

export interface IMessage extends Document {
  body: string;
  notification?: {
    item: string,
    seen: boolean
  }
  from?: {
    user: Types.ObjectId,
    seen: boolean
  };
  to?: {
    user: Types.ObjectId,
    seen: boolean
  };
}

export interface ICollection extends Document {
  name: string;
  items: Types.ObjectId[];
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  address: IAddress;
  geoLocation: IGeoLocation;
  credits: number;
  reputation: number;
  collections: Types.ObjectId[];
  inbox: Types.ObjectId[];
  newUser: boolean;
}

export interface IGeoLocation {
  latitude: number;
  longitude: number;
}

export interface IAddress {
  streetName: string;
  streetNumber: string;
  postalCode: string;
  city: string;
}