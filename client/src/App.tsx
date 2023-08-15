import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {AuthProvider, RequireAuth} from 'react-auth-kit';

import Header from "./components/Header";
import HeaderProvider from "./contexts/HeaderContext";
import TabNavigation from "./components/TabNavigation";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Profile from "./components/profile/Profile";
import CollectionOverview from "./components/collections/CollectionOverview";
import CollectionSingle from "./components/collections/CollectionSingle";
import ProfileEdit from "./components/profile/ProfileEdit";

const router = createBrowserRouter([
  {
    path: '/',
    element: (<>
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
      <RequireAuth loginPath='/login'>
        <Profile/>
      </RequireAuth>
      <TabNavigation />
    </>)
  },
  {
    path: '/profile/edit',
    element: (<>
      <RequireAuth loginPath='/login'>
        <ProfileEdit/>
      </RequireAuth>
      <TabNavigation />
    </>)
  },
  {
    path: '/collections',
    element: (<>
      <RequireAuth loginPath='/login'>
        <CollectionOverview />
      </RequireAuth>
      <TabNavigation />
    </>)
  },
  {
    path: '/collection/:collectionId',
    element: (<>
      <RequireAuth loginPath='/login'>
        <CollectionSingle />
      </RequireAuth>
      <TabNavigation />
    </>)
  }
])

function App() {
  return (<>
    <div className="app">
      <AuthProvider authType={'cookie'}
                    authName={'_auth'}
                    cookieDomain={window.location.hostname}
                    cookieSecure={window.location.protocol === 'https:'}>
        <HeaderProvider>
          <Header />
          <RouterProvider router={router} />
        </HeaderProvider>
      </AuthProvider>
    </div>
  </>);
}


export default App;
