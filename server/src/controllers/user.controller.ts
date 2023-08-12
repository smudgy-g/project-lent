import { Context } from 'koa';
import { IAddress } from '../models/user.schema';
import { createUser } from '../models/user.model';

interface INewUser {
  username: string;
  password: string;
  email: string;
  address: IAddress;
}

export async function createOne(ctx: Context, next: () => Promise<any>) {
  const user = ctx.request.body as INewUser;
  // check all details are there
  if (!user.username || !user.email || !user.password || !user.address) {
    ctx.status = 400;
    ctx.body = 'One or more fields are incomplete.';
  } else {
    try {
      // create welcome chat!
      // then add that to the user inbox 🙃
      const result = await createUser(
        user.username,
        user.email,
        user.password,
        user.address
      );
      ctx.status = 201;
      ctx.body = result;
    } catch (error) {
      ctx.status =400;
      ctx.body = error;
    }
  }
}
