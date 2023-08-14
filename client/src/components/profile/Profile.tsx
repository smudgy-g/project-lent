import { useState } from "react";
import { loginUser } from "../../service/apiService";

/* Type Definitions */
export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  address: string;
  geoLocation: GeolocationPosition,
  credits: number;
  collections: Collection[];
  reputation: number;
  inbox: Chat[]
}

export interface Collection {
  id: string;
  name: string;
  items: Item[]
}

export interface Chat {
  id: string;
  item: Item['id'];
  messages: Message[];
  updatedAt: number;
}

export interface Message {
  id: string;
  body: string;
  from: User['id'];
  to: User['id'];
  timestamp: number;
  seen: boolean;
}

export interface Item {
  id: string;
  user: User;
  name: string;
  photo: string;
  value: number;
  description: string;
  collections: Collection[];
  lendable: boolean;
  available: boolean;
  borrowed: boolean;
}

function Profile() {

  /* State Variables */


  /* Handler Functions */


  /* Render Component */

  return (<>
      
  </>);
}

export default Profile;