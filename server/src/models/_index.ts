import { connect } from 'mongoose';
import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFileName = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

dotenv.config({ path: envFileName });

const connectionString = process.env.DB_URL as string;

async function connectDb() {
  return await connect(connectionString);
}

export default connectDb;