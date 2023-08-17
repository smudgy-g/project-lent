import { Context } from 'koa';
import { findUserByUsername } from '../models/user.model';
import bcrypt from 'bcrypt';
import { generateJWT } from '../helpers/webToken';
import { ILogin } from '../types'


export async function login (ctx: Context): Promise<any | null> {
  try {
    const { username, password } = ctx.request.body as ILogin;
  
    if (!username || !password) {
      ctx.status = 400;
      ctx.body = { message: 'One or more fields are empty.'};
      return;
    }
  
    const user = await findUserByUsername(username);
    if (!user) {
      ctx.status = 401;
      ctx.body = { message: 'Invalid credentials.'};
      return;
    }
    
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      ctx.status = 401;
      ctx.body = { message: 'Invalid credentials.'};
      return;
    } 
  
    const token = generateJWT(user._id, user.geoLocation);

    ctx.status = 200;
    ctx.body = { user, token };
    
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }  

}