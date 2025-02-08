import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Login from '../components/Login'
import Register from '../components/Register'
import Recording from '../components/Recording'

const router  = createBrowserRouter(
  [
    {
      path: "/",
      element: <>
        <Register></Register>
      </>
    },
    {
      path: "/login",
      element: <>
        <Login></Login>
      </>
    }
  ]
)

function App() {

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
