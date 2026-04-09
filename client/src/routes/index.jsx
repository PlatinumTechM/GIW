import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
// import Home from "@/modules/home/Home";
import Home from "@/modules/home/Home1";
// import Home from "@/modules/home/Home2";
// import Home from "@/modules/home/Home3";
// import Home from "@/modules/home/Home4";
// import Home from "@/modules/home/Home5";
// import Home from "@/modules/home/Home6";
// import Home from "@/modules/home/Home7";
// import Home from "@/modules/home/Home8";
// import Home from "@/modules/home/Home9";
// import Home from "@/modules/home/Home10";
// import Home from "@/modules/home/Home11";
// import Home from "@/modules/home/Home12";
// import Home from "@/modules/home/Home13";
// import Home from "@/modules/home/Home14";
// import Home from "@/modules/home/Home15";
// import Home from "@/modules/home/Home16";
// import Home from "@/modules/home/Home17";
import Register from "@/modules/users/Register";
import Login from "@/modules/users/Login";
import ForgotPassword from "@/modules/users/ForgotPassword";
import Pricing from "@/modules/pricing/Pricing";
import Contact from "@/modules/contact/Contact";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home/>,
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
    ],
  },
]);
