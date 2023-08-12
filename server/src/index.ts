import Koa from 'koa';
import parser from 'koa-bodyparser';
import cors from 'koa-cors';
import dotenv from 'dotenv';
import { router } from './router';

// Local environment variables
dotenv.config();

const app = new Koa();

// Middlewares

app.use(cors());
app.use(parser());
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Live from Berlin at port ${PORT}, its Project Lent. 🚀`);
});

// npx nodemon --exec npx ts-node src/index.ts
