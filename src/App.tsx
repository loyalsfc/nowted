import {createBrowserRouter, RouterProvider, redirect} from 'react-router-dom'
import Homepage from './pages/homepage'
import Login from './pages/login'
import UserContextProvider from '../context'
import { supabase } from '../config'
import Folders from './pages/folders'
import { QueryClient, QueryClientProvider } from 'react-query'

const loader = async () => {
  const {data} = await supabase.auth.getSession();
  if (!data?.session?.user) {
    return redirect("/login");
  }
  return data?.session?.user.id ?? null;
}

const router = createBrowserRouter([
    {
      path: "/",
      loader,
      element: <Homepage />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: '/:id',
      loader,
      element: <Folders />,
      children: [
        {
          path: '/:id/:slug',
          element: <></>
        },
      ]
    }
])

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
    </QueryClientProvider>
    )
}

export default App
