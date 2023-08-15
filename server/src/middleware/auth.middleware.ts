import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Context, Next } from 'koa';

dotenv.config();
const secretKey = process.env.JWT_SECRET as string;

export async function authenticate (ctx: Context, next: Next): Promise<void> {
  // extract token from authorisation header
  const token = ctx.headers.cookie;
  console.log(token)

  if (token) {
    try {
      // Verify and decode the token
      const decodedToken = jwt.verify(token, secretKey) as JwtPayload;

      // Extract the user ID and the geolocation
      ctx.userId = decodedToken.userId;
      ctx.location = decodedToken.location;

      await next()
    } catch (error) {
      ctx.status = 401;
      ctx.body = { message: 'Invalid token.' };
    }
  } else {
    ctx.status = 401;
    ctx.body = { message: 'No token provided.' };
  }
}