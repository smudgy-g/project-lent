import { Schema, model, connect } from 'mongoose';

// Create interface reresenting document in MongoDb
interface IUser {
  username: string;
  email: string;
  password: string; // hashed
  address: string; // or stored geo-location
  credits: number;
  reputation: number;
  collections: ICollection[];
  inbox: IChat[];
}

interface ICollection {
  name: string;
  items: IItem[];
}

interface IItem {
  user: string; // user._id
  name: string;
  photo: string; // URL to cloudinary link
  value: number;
  description: string;
  lendable: boolean;
  available: boolean;
  ccollections: ICollection[];
}

interface IChat {
  item: string // item._id
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String,
});

// 3. Create a Model.
const User = model<IUser>('User', userSchema);

run().catch((err) => console.log(err));

async function run() {
  // 4. Connect to MongoDB
  await connect('mongodb://127.0.0.1:27017/test');

  const user = new User({
    name: 'Bill',
    email: 'bill@initech.com',
    avatar: 'https://i.imgur.com/dM7Thhn.png',
  });
  await user.save();

  console.log(user.email); // 'bill@initech.com'
}
