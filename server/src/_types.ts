// Create interface reresenting document in MongoDb
export interface IUser {
  username: string;
  email: string;
  password: string; // hashed
  address: string; // or stored geo-location
  credits: number;
  reputation: number;
  collections: ICollection[]; // collection._id
  inbox: IChat[];
}

export interface ICollection {
  name: string;
  items: IItem[]; // item._id
}

export interface IItem {
  user: string; // user._id
  name: string;
  photo?: string; // URL to cloudinary link
  value: number;
  description: string;
  lendable: boolean;
  available: boolean;
  collections: ICollection[];
}

export interface IChat {
  item: string; // item._id
  messages: IMessage[];
  updatedAt: number; // timestamp
}

export interface IMessage {
  body: string;
  from: string; // A user._id
  to: string; // B user._id
  timestamp: number; // timestamp
  seen: boolean;
}
