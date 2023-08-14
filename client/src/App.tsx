import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: '/',
    element: undefined
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
