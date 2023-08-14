import { Context } from 'koa';
import { IAddress, IUser, User } from '../models/user.schema';
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
} from '../models/user.model';

interface INewUser {
  username: string;
  password: string;
  email: string;
  address: IAddress;
}

export async function createOne (ctx: Context, next: () => Promise<any>) {
  const user = ctx.request.body as INewUser;
  // check all details are there
  if (!user.username || !user.email || !user.password || !user.address) {
    ctx.status = 400;
    ctx.body = {message: 'One or more fields are empty.'};
    return;
  }
  try {
    // check if email exists
    const emailExists = await findUserByEmail(user.email);
    if (emailExists) {
      ctx.status = 400;
      ctx.body = { message: 'Email already exists.' };
      return;
    }
    // if not check if username is taken
    const usernameExists = await findUserByUsername(user.username);
    if (usernameExists) {
      ctx.status = 400;
      ctx.body = { message: 'Username already exists.' };
      return;
    }
    // create welcome chat!
    // then add that to the user inbox 🙃
    const newUser = await createUser(
      user.username,
      user.email,
      user.password,
      user.address
    );
    
    ctx.status = 201;
    ctx.body = newUser;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

export async function getUserById (ctx: Context) {
  const id = ctx.params.id;
  if (!id) {
    ctx.status = 400;
    ctx.body = { message: 'User ID was not supplied.' };
    return;
  }
  try {
    /*
    const { username, email, address, credits } = (await findUserById(
      id
    )) as IUser;
    const result = { username, email, address, credits };
    */  

    const result = await findUserById(id);

    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}
