import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {AuthProvider, RequireAuth} from 'react-auth-kit';

import HeaderProvider from "./contexts/HeaderContext";
import Header from "./components/navigation/Header";
import TabNavigation from "./components/navigation/TabNavigation";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Profile from "./components/profile/Profile";
import CollectionOverview from "./components/collections/CollectionOverview";
import CollectionSingle from "./components/collections/CollectionSingle";
import ProfileEdit from "./components/profile/ProfileEdit";
import Inbox from "./components/messaging/Inbox";
import ItemSingle from "./components/collections/ItemSingle";
import ItemEdit from "./components/collections/ItemEdit";
import ItemAdd from "./components/collections/ItemAdd";
import Discover from "./components/discover/Discover";
import ModalProvider from "./contexts/ModalContext";
import CollectionAdd from "./components/collections/CollectionAdd";
import CollectionEdit from "./components/collections/CollectionEdit";
import CollectionItemAdd from './components/collections/CollectionItemAdd'
import SocketProvider from "./contexts/SocketContext";
import { io, Socket } from "socket.io-client";
import { useEffect } from "react";

const router = createBrowserRouter([
  {
    path: '/',
    element: (<>
      <Header />
      <RequireAuth loginPath='/login'>
        <CollectionOverview />
      </RequireAuth>
      <TabNavigation />
    </>)
  },
  {
    path: '/register',
    element: (<>
      <Register/>
    </>)
  },
  {
    path: '/login',
    element: (<>
      <Login/>
    </>)
  },
  {
    path: '/profile',
    element: (<>
      <Header />
      <RequireAuth loginPath='/login'>
        <Profile/>
      </RequireAuth>
      <TabNavigation />
    </>)
  },
  {
    path: '/profile/edit',
    element: (<>
      <Header />
      <RequireAuth loginPath='/login'>
        <ProfileEdit/>
      </RequireAuth>
      <TabNavigation />
    </>)
  },
  {
    path: '/collections',
    element: (<>
      <Header />
      <RequireAuth loginPath='/login'>
        <CollectionOverview />
      </RequireAuth>
      <TabNavigation />
    </>)
  },
  {
    path: '/collection/:collectionId',
    element: (<>
      <Header />
      <RequireAuth loginPath='/login'>
        <CollectionSingle />
      </RequireAuth>
      <TabNavigation />
    </>)
  },
  {
    path: '/item/:itemId',
    element: (<>
      <Header />
      <RequireAuth loginPath="/login">
        <ItemSingle />
      </RequireAuth>
      <TabNavigation />
    </>)
  },
  {
    path: '/item/add',
    element: (<>
      <Header />
      <RequireAuth loginPath="/login">
        <ItemAdd />
      </RequireAuth>
      <TabNavigation />
    </>)
  },
  {
    path: '/item/:itemId/edit',
    element: (<>
      <Header />
      <RequireAuth loginPath="/login">
        <ItemEdit />
      </RequireAuth>
      <TabNavigation />
    </>)
  },
  {
    path: '/discover',
    element: (<>
      <div></div>
      <RequireAuth loginPath="/login">
        <Discover />
      </RequireAuth>
      <TabNavigation />
    </>)
  },
  {
    path: '/inbox',
    element: (<>
      <div></div>
      <RequireAuth loginPath='/login'>
        <Inbox />
      </RequireAuth>
      <TabNavigation />
    </>)
  },
  {
    path: '/collection/add',
    element: (<>
      <Header />
      <RequireAuth loginPath='/login'>
        <CollectionAdd />
      </RequireAuth>
      <TabNavigation />
    </>)
  },
  {
    path: '/collection/edit/:collectionId',
    element: (<>
      <Header />
      <RequireAuth loginPath='/login'>
        <CollectionEdit />
      </RequireAuth>
      <TabNavigation />
    </>)
  },
  {
    path: '/item/add/:collectionId',
    element: (<>
      <Header />
      <RequireAuth loginPath='/login'>
        <CollectionItemAdd/>
      </RequireAuth>
      <TabNavigation />
    </>)
  },
])

function App() {

  // useEffect(() => {
  //   const socket: Socket = io('http://localhost:5001');

  //   socket.on('connect', () => {
  //     console.log('Connected to server with id:', socket.id);
  //   })

  //   // if (currentChatId && userId) {
  //   //   socket.emit('join_chat', currentChatId, userId);
  //   // }

  //   // socket.on('new_message_in_room', (message) => {
  //   //   console.log('New message:', message);
  //   //   setCurrentChat((prevChat) => {
  //   //     return {
  //   //       ...prevChat!,
  //   //       messages: [
  //   //         message,
  //   //         ...prevChat!.messages, 
  //   //       ],
  //   //     }
  //   //   })
  //   // });

  //   return () => {
  //     console.log('unmounted!!!!!');
  //     socket.close();
  //     socket.off("connect");
  //     // socket.off("join_chat");
  //     // socket.off("new_message_in_room");
  //   };
  // }, [])

  return (<>
    <div className="app">
      <SocketProvider>
        <AuthProvider authType={'cookie'}
                    authName={'_auth'}
                    cookieDomain={window.location.hostname}
                    cookieSecure={window.location.protocol === 'https:'}>
          <HeaderProvider>
            <ModalProvider>
              <RouterProvider router={router} />
            </ModalProvider>
          </HeaderProvider>
        </AuthProvider>
      </SocketProvider>
    </div>
  </>);
}


export default App;
