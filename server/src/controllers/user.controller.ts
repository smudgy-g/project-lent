import { Context } from 'koa';
import { IAddress, IUser, User } from '../models/user.schema';
import * as userModel from '../models/user.model';
import { INewUser } from '../_types';


export async function createOne (ctx: Context, next: () => Promise<any>) {
  const user = ctx.request.body as INewUser;
  // check all details are there
  if (!user.username || !user.email || !user.password || !user.address) {
    ctx.status = 400;
    ctx.body = {message: 'One or more fields are empty.'};
    return;
  }
  try {
    const emailExists = await userModel.findUserByEmail(user.email);
    if (emailExists) {
      ctx.status = 400;
      ctx.body = { message: 'Email already exists.' };
      return;
    }

    const usernameExists = await userModel.findUserByUsername(user.username);
    if (usernameExists) {
      ctx.status = 400;
      ctx.body = { message: 'Username already exists.' };
      return;
    }
    // create welcome chat!
    // then add that to the user inbox 🙃
    const newUser = await userModel.createUser(
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
    const result = await userModel.findUserById(id);

    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

export async function deleteUser (ctx:Context) {
  const userId = ctx.userId;
  if (!userId) {
    ctx.status = 400;
    ctx.body = { message: 'User ID was not supplied.' };
    return;
  }
  try {
    const result = await userModel.deleteUserById(userId)
    ctx.status = 200;
    ctx.body = { 
      succcess: true,
      message: 'User deleted.', 
      result,
    };
    return;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
    return;
  }
}