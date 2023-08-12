import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string; // hashed
  address: IAddress;
  geoLocation: string; // or stored geo-location
  credits: number;
  reputation: number;
  collections: string[]; // collection._id
  inbox: string[]; // chat._id
}

export interface IAddress extends Document {
  streetName: string;
  streetNumber: string;
  postalCode: string;
  city: string;
}

const addressSchema = new Schema<IAddress>({
  streetName: { type: String, required: true },
  streetNumber: { type: String, required: true },
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
});

// Schema for the user
const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  address: { type: addressSchema, required: true },
  geoLocation: { type: String, required: true }, // or stored geo-location
  credits: { type: Number },
  reputation: { type: Number },
  collections: [String],
  inbox: [String],
});

// Create model from schema
export const User = model<IUser>('User', userSchema);

