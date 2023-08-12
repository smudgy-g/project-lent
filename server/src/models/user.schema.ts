import { Schema, model, Document } from 'mongoose';

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

const addressSchema = new Schema<IAddress>(
  {
    streetName: { type: String, required: true },
    streetNumber: { type: String, required: true },
    postalCode: { type: String, required: true },
    city: { type: String, required: true },
  },
  { _id: false }
);

const geoLocationSchema = new Schema<IGeoLocation>(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

// Schema for the user
const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  address: { type: addressSchema, required: true },
  geoLocation: { type: geoLocationSchema, required: true },
  credits: { type: Number },
  reputation: { type: Number },
  collections: [String],
  inbox: [String],
});

// Create model from schema
export const User = model<IUser>('User', userSchema);
