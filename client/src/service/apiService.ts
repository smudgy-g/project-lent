import { LoginFormData } from "../components/auth/Login";
import { RegisterFormData } from "../components/auth/Register"

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

const baseUrl = "http://localhost:5001"

/* Profile */

export async function getUser(userId : User['id']): Promise<User | undefined> {
  try{
    const response = await fetch(`${baseUrl}/user/${userId}`)
    console.log(response)
    return await response.json()
  } catch (error){
    console.log(error)
  } 
}

/* Authentication */

export async function registerUser(registerFormData: RegisterFormData) {
  try{
    const response = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerFormData)
    });

    console.log(await response.json());
  } catch (err) {
    console.log(err);
  };
};

export async function loginUser(loginFormData: LoginFormData) {
  try{
    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginFormData)
    });

    return await response.json();
  } catch (err) {
    console.log(err);
  };
};