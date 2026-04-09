import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const App = () => {
  const location = useLocation();

  // Check if we're on auth pages (Login, Register, ForgotPassword) to hide footer
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(location.pathname);

  return (
    <>
      <Navbar />
      <main className={isAuthPage ? "" : "pt-20"}>
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
};

export default App;
