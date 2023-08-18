import { Context } from 'koa';
import { findUserByUsername } from '../models/user.model';
import bcrypt from 'bcrypt';
import { generateJWT } from '../utilities/webToken';
import { ILogin } from '../types'

export async function login (ctx: Context): Promise<any | null> {
  try {
    const { username, password } = ctx.request.body as ILogin;
    if (!username || !password) ctx.throw(400, { message: 'One or more fields are empty.' });
  
    const user = await findUserByUsername(username);
    if (!user) ctx.throw(401, { message: 'Invalid credentials.' });
    
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) ctx.throw(401, { message: 'Invalid credentials.' });

    const token = generateJWT(user._id, user.geoLocation);

    ctx.status = 200;
    ctx.body = { user, token };
  } catch (error) {
    ctx.throw(500, { message: error });
  }  
}