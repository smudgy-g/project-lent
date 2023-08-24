import { Context } from 'koa';
import { IUser } from '../types';
import * as userModel from '../models/user.model';


export async function createOne (ctx: Context) {
  const user = ctx.request.body as Partial<IUser>;

  if (!user.username || !user.email || !user.password || !user.address) {
    ctx.throw(400, {message: 'One or more fields are empty.'});
  }

  try {
    const emailExists = await userModel.findUserByEmail(user.email);
    const usernameExists = await userModel.findUserByUsername(user.username);

    if (emailExists) ctx.throw(400, { message: 'Email already exists.' });
    if (usernameExists) ctx.throw(400, { message: 'Username already exists.' });

    const newUser = await userModel.createUser(
      user.username,
      user.email,
      user.password,
      user.address
    );
    
    ctx.status = 201;
    ctx.body = newUser;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function getUserById (ctx: Context) {
  const userId = ctx.params.id;
  if (!userId) ctx.throw(404, { message: 'No user Id provided.'})
  try {
    const user = await userModel.findUserById(userId);
    ctx.status = 200;
    ctx.body = user;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}

export async function updateUser (ctx: Context) {
  const userId = ctx.userId;
  const { username, email, address, newUser } = ctx.request.body as Partial<IUser>;

  const user = await userModel.findUserById(userId);
  if (user) {
    if (username && user.username !== username) {
      const checkUsername = await userModel.findUserByUsername(username);
      if (checkUsername) ctx.throw(400, { message: 'Username already exists.' });
    }
    if (email && user.email !== email) {
      const checkEmail = await userModel.findUserByEmail(email);
      if (checkEmail) ctx.throw(400, { message: 'Email already exists.' });
    }
    const userData = { username, email, address }
    try {
      const updatedUser = await userModel.updateUserDetails(userId, userData, newUser);
      ctx.status = 200;
      ctx.body = updatedUser;
    } catch (error) {
      ctx.throw(500, { message: error });
    }
  } else {
    ctx.throw(400, { message: 'User not found.' });
  }
}


export async function deleteUser (ctx:Context) {
  const userId = ctx.userId;

  try {
    await userModel.deleteUserById(userId);
    ctx.status = 200;
    ctx.body = { success: true };
    return;
  } catch (error) {
    ctx.throw(500, { message: error });
  }
}