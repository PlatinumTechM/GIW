import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Home from "@/modules/home/Home";
import Register from "@/modules/users/Register";
import Login from "@/modules/users/Login";
import ForgotPassword from "@/modules/users/ForgotPassword";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },
]);
