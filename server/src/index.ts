import Koa from 'koa';
import parser from 'koa-bodyparser';
import cors from 'koa-cors';
import dotenv from 'dotenv';
import router from './router';
import connectDb from './models/_index';

// Local environment variables
dotenv.config();

const app = new Koa();

// Middlewares

app.use(cors({ credentials: true }));
app.use(parser());
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 5001;

// function to connect to the database and start the server
const run = async () => {
  await connectDb();
  console.log('🚧 Connected to database 🚧');
  app.listen(PORT, async () => {
    console.log(`🚀 Live from Berlin at port ${PORT}, its Project Lent. 🚀`);
  });
};

run();

// npx nodemon --exec npx ts-node src/index.ts
