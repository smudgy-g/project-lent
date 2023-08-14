import { Schema, model } from 'mongoose';
import { IAddress, IGeoLocation, IUser } from '../_types';

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
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);
