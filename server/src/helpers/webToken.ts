import jwt from 'jsonwebtoken';
import { IGeoLocation } from "../models/user.schema";
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.JWT_SECRET;

export function generateJWT (userId: string, geoLocation: IGeoLocation) {
  const payload = {
    userId: userId,
    geoLocation: geoLocation
  };
  const token = jwt.sign(payload, secretKey!);
  console.log(token)
  return token
}