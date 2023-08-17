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
import ChatSingle from "./components/messaging/ChatSingle";
import ItemSingle from "./components/collections/ItemSingle";
import ItemEdit from "./components/collections/ItemEdit";
import ItemAdd from "./components/collections/ItemAdd";
import Discover from "./components/discover/Discover";

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
      <Header />
      <RequireAuth loginPath="/login">
        <Discover />
      </RequireAuth>
      <TabNavigation />
    </>)
  },
  {
    path: '/inbox',
    element: (<>
      <Header />
      <RequireAuth loginPath='/login'>
        <Inbox />
      </RequireAuth>
      <TabNavigation />
    </>)
  },
  {
    path: '/chat/:chatId',
    element: (<>
      <Header />
      <RequireAuth loginPath='/login'>
        <ChatSingle />
      </RequireAuth>
      <TabNavigation />
    </>)
  },
])

function App() {
  return (<>
    <div className="app">
      <AuthProvider authType={'cookie'}
                    authName={'_auth'}
                    cookieDomain={window.location.hostname}
                    cookieSecure={window.location.protocol === 'https:'}>
        <HeaderProvider>
          <RouterProvider router={router} />
        </HeaderProvider>
      </AuthProvider>
    </div>
  </>);
}


export default App;
