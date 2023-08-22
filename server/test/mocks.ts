import mongoose from "mongoose";
import { IAddress, IGeoLocation } from "../src/types";

export const mockUserId = '123456';
export const mockGeoLocation: IGeoLocation = {
    latitude: 52.5075201,
    longitude: 13.3778567
  }
export const mockUserAddress: IAddress = {
    streetName: 'Hauptstrasse',
    streetNumber: '1',
    postalCode: '10317',
    city: 'Berlin',
}

export const mockUserUpdatePayload = {
  username: 'bob',
  email: 'test@bobcat.com',
  address: mockUserAddress
}

export const mockItem1 = {
  user: new mongoose.Types.ObjectId,
  name: 'Drill',
  img_url: '',
  value: 2,
  description: 'drill',
  lendable: true,
  available: true,
  collections: ['All'],
  borrowed: false
}
export const mockItem2 = {
  user: new mongoose.Types.ObjectId,
  name: 'Spade',
  img_url: '',
  value: 2,
  description: 'spade is a spade',
  lendable: true,
  available: true,
  collections: ['All'],
  borrowed: false
}

export const mockNewUser = {
  username: 'Testing',
  password: 'testing123',
  address: mockUserAddress,
  email: 'test@testing.com'
}