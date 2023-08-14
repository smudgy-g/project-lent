import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Header from "./components/Header";
import HeaderProvider from "./contexts/HeaderContext";
// import TabNavigation from "./components/TabNavigation";
const router = createBrowserRouter([
  {
    path: '/test',
    element: undefined
  }
])

function App() {
  return (<>
    <HeaderProvider>
      <Header />
      <RouterProvider router={router} />
    </HeaderProvider>
    {/* <TabNavigation /> */}
  </>);
}


export default App;
