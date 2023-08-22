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
const server = http.createServer(app.callback());
const serverOptions = {
  cors: {
    origin: 'http://localhost:3000', // Replace with the actual origin of your frontend application
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization', 'Access-Control-Allow-Origin'],
    credentials: true,
    // preflightContinue: true,
  },
};
const io = new Server(server, serverOptions);

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  headers: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(parser());
app.use(router.routes());
app.use(router.allowedMethods());

ioConnect(io);
console.log('🎪 Socket connected 🎪');

// function to connect to the database and start the server
const run = async () => {
  await connectDb();
  console.log('🚧 Connected to the database 🚧');

  server.listen(PORT, async () => {
    console.log(`🚀 Live from Berlin at port ${PORT}, it's Project Lent. 🚀`);
  });
};

run();

export { io, app };
