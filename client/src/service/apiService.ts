import { LoginFormData } from "../components/auth/Login";
import { RegisterFormData } from "../components/auth/Register"
import { ProfileEditData } from "../components/profile/ProfileEdit";
import { Chat, ChatPreview, Collection, Item, Message, MessageToSend, User } from "../types/types";

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

export async function putUser(profileEditData : ProfileEditData) {
  try {

    const response = await fetch(`${baseUrl}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileEditData),
      credentials: 'include',
    });
    return await response.json();
  } catch (err) {
    console.log(err)
  }
}

export async function deleteUser() {
  try {
    const response = await fetch(`${baseUrl}/user`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return await response.json()
  } catch (err) {
    console.log(err)
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
      body: JSON.stringify(registerFormData),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
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
      body: JSON.stringify(loginFormData),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (err) {
    console.log(err);
  };
};

/* Collection */

export async function getAllCollections (): Promise<Collection[]> {
  try {
    const response = await fetch(`${baseUrl}/collection/all`, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }
  catch (err) {
    throw new Error('An error occured');
  }
}

export async function postNewCollection (itemName: string, itemIds: string[]): Promise<Item> {
  try {
    const response = await fetch(`${baseUrl}/collection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({itemName, itemIds}),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }
  catch (err) {
    throw new Error('An error occured');
  }
};

export async function changeCollectionName (collectionName: string, collectionId: string): Promise<Item> {
  try {
    const response = await fetch(`${baseUrl}/collection/${collectionId}/name`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({newName: collectionName}),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }
  catch (err) {
    throw new Error('An error occured');
  }
};

  export async function addItemsToCollections (itemIds: string[], collectionIds: string[]): Promise<Item> {
    try {
      const response = await fetch(`${baseUrl}/collection/addItems`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({itemIds, collectionIds}),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      return data;
    }
    catch (err) {
      throw new Error('An error occured');
    }
  };

export async function deleteCollection (collectionId: string): Promise<Item> {
  try {
    const response = await fetch(`${baseUrl}/collection/${collectionId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }
  catch (err) {
    throw new Error('An error occured');
  }
}

export async function deleteItemsFromCollection (itemIds: string[], collectionId: string): Promise<Item> {
  try {
    const response = await fetch(`${baseUrl}/collection/${collectionId}/removeitems`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({items: itemIds}),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }
  catch (err) {
    throw new Error('An error occured');
  }
}

/* Item */

export async function getAllItems (): Promise<Item[]> {
  try {
    const response = await fetch(`${baseUrl}/item/all`, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }
  catch (err) {
    throw new Error('An error occured');
  }
}

export async function getItemsByCollection (id: string): Promise<Item[]> {
  try {
    const response = await fetch(`${baseUrl}/item/all/${id}`, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }
  catch (err) {
    throw new Error('An error occured');
  }
}

export async function getItemsDiscover (): Promise<Item[]> {
  try {
    const response = await fetch(`${baseUrl}/item/all/discover`, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }
  catch (err) {
    throw new Error('An error occured');
  }
}

export async function getItemsByQuery (query: string): Promise<Item[]> {
  try {
    const encodedQuery = encodeURIComponent(query);

    const response = await fetch(`${baseUrl}/search?query=${encodedQuery}`, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }
  catch (err) {
    throw new Error('An error occured');
  }
}

export async function getItemById (id: string): Promise<Item> {
  try {
    const response = await fetch(`${baseUrl}/item/${id}`, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }
  catch (err) {
    throw new Error('An error occured');
  }
}

export async function postItem (item: Item): Promise<Item> {
  try {
    const response = await fetch(`${baseUrl}/item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }
  catch (err) {
    throw new Error('An error occured');
  }
}

export async function putItemById (id: string, item: Item): Promise<Item> {
  try {
    const response = await fetch(`${baseUrl}/item/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }
  catch (err) {
    throw new Error('An error occured');
  }
}

export async function putItemReserve (id: string): Promise<Chat> {
  try {
    const response = await fetch(`${baseUrl}/item/${id}/reserve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }
  catch (err) {
    throw new Error('An error occured');
  }
}

export async function receiveItemById (id: string) {
  try {
    const response = await fetch(`${baseUrl}/item/${id}/receive`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }
  catch (err) {
    throw new Error('An error occured');
  }
}

export async function returnItemById (id: string) {
  try {
    const response = await fetch(`${baseUrl}/item/${id}/return`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  }
  catch (err) {
    throw new Error('An error occured');
  }
}

export async function cancelItemById (id: string) {
  try {
    const response = await fetch(`${baseUrl}/item/${id}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  }
  catch (err) {
    throw new Error('An error occured');
  }
}

export async function deleteItem (id: string): Promise<Item> {
  try {
    const response = await fetch(`${baseUrl}/item/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }
  catch (err) {
    throw new Error('An error occured');
  }
}

/* Messaging */

export async function getAllChats (): Promise<ChatPreview[]> {
  try {
    const response = await fetch(`${baseUrl}/inbox`, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }
  catch (err) {
    throw new Error('An error occured');
  }
}

export async function getChatbyId (chatId: string | undefined): Promise<Chat> {
  try {
    const response = await fetch(`${baseUrl}/inbox/${chatId}`, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }
  catch (err) {
    throw new Error('An error occured');
  }
}

export async function deleteChat(chatId: string) {
  try {
    const response = await fetch(`${baseUrl}/inbox/${chatId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (err) {
    console.log(err)
  }
}

export async function postMessage (currentMessageData: MessageToSend, chatId: string) {
  try{
    const response = await fetch(`${baseUrl}/inbox/${chatId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(currentMessageData),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (err) {
    console.log(err);
  };
};

export async function putMessage(message: Message) {
  try {
    const response = await fetch(`${baseUrl}/inbox/message/${message.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (err) {
    console.log(err)
  }
}