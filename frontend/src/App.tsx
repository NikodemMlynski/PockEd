
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {ToastContainer} from "react-toastify"
import { AuthProvider } from "./context/AuthProvider";
import AuthLayout from "./layouts/AuthLayout";
import RootLayout from "./layouts/RootLayout";
import Dashboard from "./components/Dashboard";
import PersonalityForm from "./components/PersonalityForm";
import Settings from "./components/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginForm from "./components/SignIn";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes,
      gcTime: 10 * 60 * 1000, // 10 minutes garbage collector time,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthProvider><AuthLayout/></AuthProvider>,
    children: [
      {
        path: "signin",
        element: <LoginForm/>
      },
      {
        path: "signup",
        element: <h1>Strona rejestracji</h1>
      }
    ]
  },
  {
    path: "/",
    element: <AuthProvider><ProtectedRoute/></AuthProvider>,
    children: [
      {path: "/",
      element: <RootLayout/>,
      children: [
        {
          index: true,
          element: <Dashboard/>
        },
        {
          path: "flashcards",
          element: <h1>Fiszki bratku</h1>
        },
        {
          path: "planning",
          element: <h1>Planowanie bratku</h1>
        },
        {
          path: "notes",
          element: <h1>Tworzenie notatek ktore potem stworza fiszki</h1>
        },
        {
          path: "informations",
          element: <h1>Strona konkursów stypendiów i najważniejszych dla uczniów informacji.</h1>
        },
        {
          path: 'profile',
          element: <Settings/>
        }
      ]}
    ]
   
  }
])
function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer/>
    </QueryClientProvider>
  )
}

export default App
