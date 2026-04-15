import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const App = () => {
  const location = useLocation();

  // Check if we're on auth pages (Login, Register, ForgotPassword) to hide footer
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(
    location.pathname,
  );
  // Check if we're on admin pages to hide navbar and footer
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}
      <main>
        <Outlet />
      </main>
      {!isAuthPage && !isAdminPage && <Footer />}
    </>
  );
};

export default App;
