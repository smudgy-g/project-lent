import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IGeoLocation } from '../types';

dotenv.config();
const secretKey = process.env.JWT_SECRET;

export function generateJWT (userId: string, geoLocation: IGeoLocation) {
  const payload = {
    userId: userId,
    geoLocation: geoLocation
  };
  return jwt.sign(payload, secretKey!, { expiresIn: '1d' });
}