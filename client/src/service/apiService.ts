import { LoginFormData } from "../components/auth/Login";
import { RegisterFormData } from "../components/auth/Register"

const baseUrl = "http://localhost:3001"

export async function registerUser(registerFormData: RegisterFormData) {
  try{
    const response = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerFormData)
    });

    return await response.json();
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