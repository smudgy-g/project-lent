import { Schema, model } from 'mongoose';
import { IAddress, IGeoLocation, IUser } from '../../types';

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
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: addressSchema, required: true },
  geoLocation: { type: geoLocationSchema, required: true },
  credits: { type: Number, min: 0 },
  reputation: { type: Number, min: 0 },
  collections: [{ type: Schema.Types.ObjectId, ref: 'Collection' }],
  inbox: [{ type: Schema.Types.ObjectId, ref: 'Chat' }],
  newUser: { type: Boolean }
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);
