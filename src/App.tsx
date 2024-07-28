import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Work from "./pages/Work";
import Login from "./pages/Login";
import Root from "./pages/Root";
import Edit from "./pages/Edit";
import Signup from "./pages/Signup";
import Forgot from "./pages/Forgot";
import { AuthProvider } from "./shared/context/AuthContext";


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'work',
        element: <Work />,
      },
      {
        path: 'edit',
        element: <Edit />
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />
      },
      {
        path: 'forgot',
        element: <Forgot />
      },
    ]
  },
])

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App;
