import { RouterProvider, createBrowserRouter } from 'react-router'
import LoginPage from './pages/login/page'
import RegisterPage from './pages/register/page'
import RootPage from './pages/root/page'

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  }
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
