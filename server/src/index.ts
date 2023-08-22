import Koa from 'koa';
import parser from 'koa-bodyparser';
import cors from 'koa-cors';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import router from './router';
import connectDb from './models/_index';
import { ioConnect } from './controllers/socketHandler.controller';

dotenv.config();
const PORT = process.env.PORT || 5001;

const app = new Koa();

app.use(cors({ credentials: true }));
app.use(parser());
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 5001;

const server = http.createServer(app.callback());
const io = new Server(server);

const run = async () => {
  await connectDb();
  console.log('🚧 Connected to database 🚧');

  app.listen(PORT, async () => {
    console.log(`🚀 Live from Berlin at port ${PORT}, its Project Lent. 🚀`);
  });

  ioConnect(io);
};

run();

export { io };

export default app;