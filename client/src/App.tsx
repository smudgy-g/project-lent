import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {AuthProvider, RequireAuth} from 'react-auth-kit';

import Header from "./components/Header";
import HeaderProvider from "./contexts/HeaderContext";
// import TabNavigation from "./components/TabNavigation";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Profile from "./components/profile/Profile";
import CollectionOverview from "./components/collections/CollectionOverview";
import CollectionSingle from "./components/collections/CollectionSingle";
import ProfileEdit from "./components/profile/ProfileEdit";

const router = createBrowserRouter([
  {
    path: '/',
    element: <CollectionOverview />
  },
  {
    path: '/register',
    element: <Register/>
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/logout',
    element: <Login/>
  },
  {
    path: '/profile',
    // element: (<RequireAuth loginPath='/login'>
    //             <Profile/>
    //           </RequireAuth>)
    element: <Profile />
  },
  {
    path: '/profile/edit',
    // element: (<RequireAuth loginPath='/login'>
    //             <Profile/>
    //           </RequireAuth>)
    element: <ProfileEdit />
  },
  {
    path: '/collections',
    element: <CollectionOverview />
  },
  {
    path: '/collection/:collectionId',
    element: <CollectionSingle />
  }
])

function App() {
  return (<>
    <AuthProvider authType={'cookie'}
                  authName={'_auth'}
                  cookieDomain={window.location.hostname}
                  cookieSecure={window.location.protocol === 'https:'}>
      <HeaderProvider>
        <Header />
        <RouterProvider router={router} />
      </HeaderProvider>
      {/* <TabNavigation /> */}
    </AuthProvider>
  </>);
}


export default App;
