import { Context } from 'koa';
import { IUser } from '../types';
import * as userModel from '../models/user.model';


export async function createOne (ctx: Context) {
  const user = ctx.request.body as Partial<IUser>;
  if (!user.username || !user.email || !user.password || !user.address) {
    ctx.status = 400;
    ctx.body = {message: 'One or more fields are empty.'};
    return;
  }
  try {
    const emailExists = await userModel.findUserByEmail(user.email);
    const usernameExists = await userModel.findUserByUsername(user.username);

    if (emailExists) {
      ctx.status = 400;
      ctx.body = { message: 'Email already exists.' };
      return;
    } else if (usernameExists) {
      ctx.status = 400;
      ctx.body = { message: 'Username already exists.' };
      return;
    }

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
  const userId = ctx.params.id;
  if (!userId) {
    ctx.status = 400;
    ctx.body = { message: 'User ID was not supplied.' };
    return;
  }
  try {
    const user = await userModel.findUserById(userId);

    ctx.status = 200;
    ctx.body = user;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

export async function updateUser (ctx: Context) {
  const userId = ctx.userId;
  const { username, email, address } = ctx.request.body as Partial<IUser>;
  if (!username || !email || !address) {
    ctx.status = 400;
    ctx.body = { message: 'One or more fields missing.' };
    return;
  }

  if (!userId) {
    ctx.status = 400;
    ctx.body = { message: 'User ID was not supplied.' };
    return;
  }

  const user = await userModel.findUserById(userId);

  if (user?.username !== username) {
    const checkUsername = await userModel.findUserByUsername(username);
    if (checkUsername) {
      ctx.status = 400;
      ctx.body = { message: 'Username already exists.'};
      return;
    }
  } else if (user?.email !== email) {
     const checkEmail = await userModel.findUserByEmail(email);
    if (checkEmail) {
      ctx.status = 400;
      ctx.body = { message: 'Email already exists.' };
      return;
    }
  }

  const userData = { username, email, address }

  try {
    const updatedUser = await userModel.updateUserDetails(userId, userData);
    ctx.status = 200;
    ctx.body = updatedUser;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
    return;
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
    await userModel.deleteUserById(userId);

    ctx.status = 200;
    ctx.body = { success: true };
    return;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
    return;
  }
}