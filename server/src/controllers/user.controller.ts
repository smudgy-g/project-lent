import { Context } from 'koa';
import { IAddress, IUser } from '../_types';
import * as userModel from '../models/user.model';


export async function createOne (ctx: Context) {
  const user = ctx.request.body as Partial<IUser>;
  // check all details are there
  if (!user.username || !user.email || !user.password || !user.address) {
    ctx.status = 400;
    ctx.body = {message: 'One or more fields are empty.'};
    return;
  }
  try {
    const detailsExist = await userModel.checkEmailUsernameExist(user.email, user.email);
    if (detailsExist) {
      ctx.status = 400;
      ctx.body = { message: detailsExist.message };
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
    const user = await userModel.findUserById(id);

    ctx.status = 200;
    ctx.body = user;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error };
  }
}

export async function updateUser (ctx: Context) {
  console.log('hello update user');
  const id = ctx.userId;
  const { username, email, address } = ctx.request.body as Partial<IUser>;
  
  console.log({ username, email, address });
  if (!username || !email || !address) {
    ctx.status = 400;
    ctx.body = { message: 'One or more fields missing.' };
    return;
  }

  const user = await userModel.findUserById(id);

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
    const updatedUser = await userModel.updateUserDetails(id, userData);
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