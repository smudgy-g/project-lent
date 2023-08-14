import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
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
    <RouterProvider router={router} />
    <h1>Navigation</h1>
  </>);
}


export default App;
