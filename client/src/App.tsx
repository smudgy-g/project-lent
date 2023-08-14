import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {AuthProvider, RequireAuth} from 'react-auth-kit'

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

const router = createBrowserRouter([
  {
    path: '/',
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
    <h1>Header</h1>
    <AuthProvider authType={'cookie'}
                  authName={'_auth'}
                  cookieDomain={window.location.hostname}
                  cookieSecure={window.location.protocol === 'https:'}>
      <RouterProvider router={router} />
    </AuthProvider>
    <h1>Navigation</h1>
  </>);
}


export default App;
