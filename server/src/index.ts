import Koa from 'koa';
import parser from 'koa-bodyparser';
import cors from 'koa-cors';
import dotenv from 'dotenv';
import router from './router';
import connectDb from './models/_index';

dotenv.config();

const app = new Koa();

app.use(cors({ credentials: true }));
app.use(parser());
app.use(router.routes());
app.use(router.allowedMethods());

export default app;