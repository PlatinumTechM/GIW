import { createBrowserRouter, Navigate } from "react-router-dom";
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
import AddStock from "@/modules/stock/AddStock";
import AddStockManual from "@/modules/stock/AddStockManual";
import JewelleryStock from "@/modules/stock/jewellery/JewelleryStock";
import SharePage from "@/modules/share/SharePage";
import NotificationPage from "@/modules/notifications/NotificationPage";
import FavoritesPage from "@/modules/user/Favorites/FavoritesPage";
import NotFound from "@/components/NotFound";

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
        path: "/:role/home",
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
        path: "/favorites",
        element: (
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ":role/natural-diamonds",
        element: (
          <ProtectedRoute>
            <NaturalDiamond />
          </ProtectedRoute>
        ),
      },
      {
        path: ":role/lab-grown-diamonds",
        element: (
          <ProtectedRoute>
            <LabGrownDiamond />
          </ProtectedRoute>
        ),
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
        path: ":role/pricing",
        element: (
          <ProtectedRoute>
            <Pricing />
          </ProtectedRoute>
        ),
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: ":role/jewelry",
        element: (
          <ProtectedRoute>
            <Jewelry />
          </ProtectedRoute>
        ),
      },
      {
        path: "/jewelry",
        element: (
          <ProtectedRoute>
            <Jewelry />
          </ProtectedRoute>
        ),
      },
      {
        path: ":role/lab-grown-jewelry",
        element: (
          <ProtectedRoute>
            <LabGrownJewelry />
          </ProtectedRoute>
        ),
      },
      {
        path: "/lab-grown-jewelry",
        element: (
          <ProtectedRoute>
            <LabGrownJewelry />
          </ProtectedRoute>
        ),
      },
      {
        path: ":role/diamond/:type/:id",
        element: (
          // <ProtectedRoute>
            <DiamondDetail />
          // </ProtectedRoute>
        ),
      },
      {
        path: ":role/jewelry/:type/:id",
        element: (
          // <ProtectedRoute>
            <JewelryDetail />
          // </ProtectedRoute>
        ),
      },
      {
        path: ":role/diamond",
        element: (
          <ProtectedRoute>
            <AddStock />
          </ProtectedRoute>
        ),
      },
      {
        path: ":role/diamond-manually",
        element: (
          <ProtectedRoute>
            <AddStockManual />
          </ProtectedRoute>
        ),
      },
      {
        path: ":role/jewellery",
        element: (
          <ProtectedRoute>
            <JewelleryStock />
          </ProtectedRoute>
        ),
      },
      {
        path: "/share/:token",
        element: <SharePage />,
      },
      {
        path: "/notifications",
        element: (
          <ProtectedRoute>
            <NotificationPage />
          </ProtectedRoute>
        ),
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
      // Legacy Redirects
      {
        path: "/user/home",
        element: <Navigate to="/buyer/home" replace />,
      },
      {
        path: "/user/add-stock",
        element: <Navigate to="/seller/diamond" replace />,
      },
      {
        path: "/user/jewellry-stock",
        element: <Navigate to="/seller/jewellery" replace />,
      },
      {
        path: "/user/natural-diamonds",
        element: <Navigate to="/buyer/natural-diamonds" replace />,
      },
      {
        path: "/user/lab-grown-diamonds",
        element: <Navigate to="/buyer/lab-grown-diamonds" replace />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
