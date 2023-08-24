import { connect  } from 'mongoose';
import {MongoClient, ServerApiVersion} from 'mongodb';
import dotenv from 'dotenv';

const connectionString = process.env.DB_URL as string;

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFileName = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

dotenv.config({ path: envFileName });

const client = new MongoClient(connectionString, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDb() {
  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("lentDB").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export default connectDb;