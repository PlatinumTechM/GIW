import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/modules/home/Home";
import UserHome from "@/modules/user/Home";
import Profile from "@/components/Profile";
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
import Jewelry from "@/modules/user/jewelry/Jewelry";
import LabGrownJewelry from "@/modules/user/jewelry/LabGrownJewelry";
import DiamondDetail from "@/modules/user/Diamond/DiamondDetail";
import JewelryDetail from "@/modules/user/jewelry/JewelryDetail";
import ManageSubscription from "@/modules/admin/ManageSubscription";

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
        element: (
          <ProtectedRoute>
            <UserHome />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute allowAdmin>
            <Profile />
          </ProtectedRoute>
        ),
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
        path: "/jewelry",
        element: <Jewelry />,
      },
      {
        path: "/lab-grown-jewelry",
        element: <LabGrownJewelry />,
      },
      {
        path: "/diamond/:type/:id",
        element: <DiamondDetail />,
      },
      {
        path: "/jewelry/:type/:id",
        element: <JewelryDetail />,
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "",
            element: <AdminDashboard />,
          },
          {
            path: "subscription",
            element: <ManageSubscription />,
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
