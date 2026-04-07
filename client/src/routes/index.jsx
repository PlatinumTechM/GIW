import { createBrowserRouter } from "react-router-dom";
import Home from "@/modules/home/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);
