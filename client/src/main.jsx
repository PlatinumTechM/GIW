import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./routes/index.jsx";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import "@/styles/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
