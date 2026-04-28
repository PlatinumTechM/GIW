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
  // Check if we're on admin or share pages to hide navbar and footer
  const isSpecialPage = location.pathname.startsWith("/admin") || location.pathname.startsWith("/share");

  return (
    <>
      {!isSpecialPage && !isAuthPage && <Navbar />}
      <main>
        <Outlet />
      </main>
      {!isAuthPage && !isSpecialPage && <Footer />}
      
      {/* Global AI Search Sticky Component */}
      {!isSpecialPage && <AISearchChat />}
    </>
  );
};

export default App;
