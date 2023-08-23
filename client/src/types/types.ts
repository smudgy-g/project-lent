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
  inbox: Chat[];
  newUser?: boolean  ;
}

export interface Item {
  _id?: string;
  user?: User;
  name?: string;
  img_url?: string | undefined;
  value?: number;
  description?: string;
  collections?: string[];
  lendable?: boolean;
  available?: boolean;
  borrowed?: boolean;
  distance?: number;
  foreignUserId?: string;
}

export interface Collection {
  _id?: string;
  name?: string;
  items?: Item[];
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
  img_url: string;
  messages: Message[];
  updatedAt: number;
  foreignUser: string;
  unreadMessages?: number;
}

export interface Message {
  id?: string;
  body?: string;
  notification?: {
    item?: string,
    seen: boolean,
  }
  from?: {
    user: User['id'],
    seen: boolean,
  }
  to?: {
    user: User['id'],
    seen: boolean,
  }
  foreignUserName?: string ;
  createdAt?: number | string;
}

export interface MessageToSend {
  body: string;
  from: User['id'];
  to?: User['id'] ;
}

export type ActionButtonData = {
  type?: string;
  title: string;
  action: () => void;
};

export type ActionButtonGroupData = (ActionButtonData | ActionButtonData[])[];