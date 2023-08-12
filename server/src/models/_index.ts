import { Schema, model, connect } from 'mongoose';
import dotenv from 'dotenv'

// Set the NODE_ENV variable to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Load environment variables from the appropriate .env file
const envFileName = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

dotenv.config({ path: envFileName });

// Retrieve the database URL from the environment variables
const connectionString = process.env.DB_URL as string;

console.log(connectionString);

async function connectDb () {
  return await connect(connectionString);
};

export default connectDb;