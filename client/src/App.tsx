import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Header from "./components/Header";
import HeaderProvider from "./contexts/HeaderContext";
import TabNavigation from "./components/TabNavigation";
import Test from "./components/Test";
import Test2 from "./components/Test2";

const router = createBrowserRouter([
  {
    path: '/test',
    element: <Test />
  },
  {
    path: '/test2',
    element: <Test2 />
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
