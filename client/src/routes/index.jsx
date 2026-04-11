import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Home from "@/modules/home/Home";
import UserHome from "@/modules/user/Home";
import NaturalDiamond from "@/modules/user/Diamond/NaturalDiamond";
import LabGrownDiamond from "@/modules/user/Diamond/LabGrownDiamond";
import Register from "@/modules/auth/Register";
import Login from "@/modules/auth/Login";
import ForgotPassword from "@/modules/auth/ForgotPassword";
import Pricing from "@/modules/pricing/Pricing";
import Contact from "@/modules/contact/Contact";
import AdminLayout from "@/modules/admin/AdminLayout";
import AdminDashboard from "@/modules/admin/Dashboard";
import UserManagement from "@/modules/admin/UserManagement";

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
        path: "/user/home",
        element: <UserHome />,
      },
      {
        path: "/natural-diamonds",
        element: <NaturalDiamond />,
      },
      {
        path: "/lab-grown-diamonds",
        element: <LabGrownDiamond />,
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
      {
        path: "/pricing",
        element: <Pricing />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            path: "",
            element: <AdminDashboard />,
          },
          {
            path: "users",
            element: <UserManagement />,
          },
        ],
      },
    ],
  },
]);
