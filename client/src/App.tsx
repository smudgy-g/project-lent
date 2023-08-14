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

const router = createBrowserRouter([
  {
    path: '/test',
    element: undefined
  },
  {
    path: '/register',
    element: <Register/>
  },
  {
    path: '/login',
    element: <Login/>
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
