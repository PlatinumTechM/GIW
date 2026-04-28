import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AISearchChat from "@/components/AISearchChat";

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
      <main className={!isAdminPage ? "pt-20 sm:pt-24" : ""}>
        <Outlet />
      </main>
      {!isAuthPage && !isAdminPage && <Footer />}
      
      {/* Global AI Search Sticky Component */}
      {!isAdminPage && <AISearchChat />}
    </>
  );
};

export default App;
