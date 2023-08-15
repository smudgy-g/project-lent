import { LoginFormData } from "../components/auth/Login";
import { RegisterFormData } from "../components/auth/Register"
import { User } from "../types/types";

const baseUrl = "http://localhost:5001"

/* Profile */

// Helper Function to get the userId 
function getCookieValue(cookieName : string)  {
  const cookies = document.cookie.split(';');

  for (var i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();

    // Check if the cookie starts with the provided name
    if (cookie.indexOf(cookieName + '=') === 0) {
      // Get the value of the cookie
      const cookieValue = cookie.substring(cookieName.length + 1);
      
      // Decode the cookie value
      const decodedValue = decodeURIComponent(cookieValue);
      
      // Return the decoded value
      return decodedValue;
    }
  }
  // Cookie not found
  return '';
}

export async function getUser(): Promise<User> {
  try{
    const userIdObject = getCookieValue('_auth_state');
    const parsedUserIdObject = JSON.parse(userIdObject);
    const userId = parsedUserIdObject._id;

    const response = await fetch(`${baseUrl}/user/${userId}`);

    const data = await response.json();

    if(!response.ok) {
      throw new Error (data.message);
    }

    return data;
  } catch (error){
    throw new Error('An error occured');
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