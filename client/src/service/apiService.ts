import { LoginFormData } from "../components/auth/Login";
import { RegisterFormData } from "../components/auth/Register"
import { Collection, User } from "../types/types";

const baseUrl = "http://localhost:5001"

/* Profile */

export async function getUser (userId : User['id']): Promise<User | undefined> {
  try{
    const response = await fetch(`${baseUrl}/user/${userId}`);
    return await response.json();
  } catch (error){
    console.log(error);
  }
}

/* Authentication */

export async function registerUser (registerFormData: RegisterFormData) {
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

export async function loginUser (loginFormData: LoginFormData) {
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

/* Collection */

export async function getAllCollections (): Promise<Collection[]> {
  const response = await fetch(`${baseUrl}/collection/all`);
  return await response.json();
}