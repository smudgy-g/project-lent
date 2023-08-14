import { Context } from 'koa';
import { findUserByUsername } from '../models/user.model';
import bcrypt from 'bcrypt';
import { IUser } from '../models/user.schema';

interface ILogin {
  username: string;
  password: string;
}

export async function login(ctx: Context): Promise<any | null> {
  const { username, password } = ctx.request.body as ILogin;

  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { message: 'One or more fields are empty.'};
    return;
  }
  // find user by username
  const user = findUserByUsername(username);
  if (!user) {
    ctx.status = 401;
    ctx.body = { message: 'Invalid credentials.'};
    return;
  } else {
    const validPassword = await bcrypt.compare(password, user.password)
    if (!user) {
      ctx.status = 401;
      ctx.body = { message: 'Invalid credentials.'};
      return;
    } 

  }


  // check password is a match

}