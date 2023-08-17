import { Address } from "../components/auth/Register";

export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  address: Address;
  geoLocation: GeolocationPosition,
  credits: number;
  collections: Collection[];
  reputation: number;
  inbox: Chat[]
}

export interface Item {
  _id?: string;
  user?: User;
  name?: string;
  img_url?: string;
  value?: number;
  description?: string;
  collections?: Collection[];
  lendable?: boolean;
  available?: boolean;
  borrowed?: boolean;
  distance?: number;
}

export interface Collection {
  _id?: string;
  name: string;
  items: Item[]
}

export interface Chat {
  _id: string;
  item: {
    name: string;
    user: string;
    _id: string;
  };
  messages: Message[];
  users: string[];
  foreignUserName: User['id'];
  foreignUserId: string;
}

export interface ChatPreview {
  id: string;
  itemId: Item['_id'];
  itemName: string;
  message: string;
  updatedAt: number;
  foreignUser: string;
}

export interface Message {
  id: string;
  body: string;
  from: User['id'];
  foreignUserName: string ;
  to: User['id'];
  createdAt: number;
  seen: boolean;
}

export interface MessageToSend {
  body: string;
  from: User['id'];
  to?: User['id'] ;
  seen: boolean;
}