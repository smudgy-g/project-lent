import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {AuthProvider} from 'react-auth-kit';

import Layout from "./Layout";
import SocketProvider from "./contexts/SocketContext";
import HeaderProvider from "./contexts/HeaderContext";
import ModalProvider from "./contexts/ModalContext";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

import Profile from "./components/profile/Profile";
import ProfileEdit from "./components/profile/ProfileEdit";

import CollectionOverview from "./components/collections/CollectionOverview";
import CollectionSingle from "./components/collections/CollectionSingle";
import CollectionAdd from "./components/collections/CollectionAdd";
import CollectionEdit from "./components/collections/CollectionEdit";
import CollectionItemAdd from './components/collections/CollectionItemAdd'

import ItemSingle from "./components/collections/ItemSingle";
import ItemEdit from "./components/collections/ItemEdit";
import ItemAdd from "./components/collections/ItemAdd";

import Discover from "./components/discover/Discover";
import Inbox from "./components/messaging/Inbox";
import LandingPage from "./components/landing/LandingPage";

const router = createBrowserRouter([
  {
    path: '/landing',
    element: (<>
      <LandingPage />
    </>)
  },
  {
    path: '/',
    element: (<>
      <Layout>
        <CollectionOverview />
      </Layout>
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
      <Layout>
        <Profile/>
      </Layout>
    </>)
  },
  {
    path: '/profile/edit',
    element: (<>
      <Layout>
        <ProfileEdit/>
      </Layout>
    </>)
  },
  {
    path: '/collections',
    element: (<>
      <Layout>
        <CollectionOverview />
      </Layout>
    </>)
  },
  {
    path: '/collection/:collectionId',
    element: (<>
      <Layout>
        <CollectionSingle />
      </Layout>
    </>)
  },
  {
    path: '/item/:itemId',
    element: (<>
      <Layout>
        <ItemSingle />
      </Layout>
    </>)
  },
  {
    path: '/item/add',
    element: (<>
      <Layout>
        <ItemAdd />
      </Layout>
    </>)
  },
  {
    path: '/item/:itemId/edit',
    element: (<>
      <Layout>
        <ItemEdit />
      </Layout>
    </>)
  },
  {
    path: '/discover',
    element: (<>
      <Layout options={{header: false}}>
        <Discover />
      </Layout>
    </>)
  },
  {
    path: '/inbox',
    element: (<>
      <Layout options={{header: false}}>
        <Inbox />
      </Layout>
    </>)
  },
  {
    path: '/collection/add',
    element: (<>
      <Layout>
        <CollectionAdd />
      </Layout>
    </>)
  },
  {
    path: '/collection/edit/:collectionId',
    element: (<>
      <Layout>
        <CollectionEdit />
      </Layout>
    </>)
  },
  {
    path: '/item/add/:collectionId',
    element: (<>
      <Layout>
        <CollectionItemAdd/>
      </Layout>
    </>)
  },
])

export default function App() {
  return (<>
    <div className="app">
      <AuthProvider
        authType={'cookie'}
        authName={'_auth'}
        cookieDomain={window.location.hostname}
        cookieSecure={window.location.protocol === 'https:'}
      >
        <SocketProvider>
          <HeaderProvider>
            <ModalProvider>
              <RouterProvider router={router} />
            </ModalProvider>
          </HeaderProvider>
        </SocketProvider>
      </AuthProvider>
    </div>
  </>);
}
