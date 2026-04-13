import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    {
      path: "/jewelry",
      label: "Jewelry",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    },
    {
      path: "/lab-grown-jewelry",
      label: "Lab-Grown",
      icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
    },
    {
      path: "/pricing",
      label: "Pricing",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      path: "/contact",
      label: "Contact",
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
    {
      path: "/admin",
      label: "Admin",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    },
  ];

  // Check if we're on auth pages (Login, Register, ForgotPassword) to hide navbar
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(
    location.pathname,
  );
  if (isAuthPage) return null;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(15,23,42,0.08)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6]"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-[#0F172A]">
                GIW
              </span>
              <span className="hidden sm:block text-[10px] tracking-[0.2em] uppercase text-[#64748B]">
                Diamond Exchange
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? "bg-[#1E3A8A] text-white shadow-lg shadow-[#1E3A8A]/20"
                      : "text-[#475569] hover:text-[#1E3A8A] hover:bg-[#F1F5F9]"
                  }`
                }
              >
                {({ isActive }) => (
                  <motion.span
                    className="flex items-center gap-2"
                    whileHover={{ x: isActive ? 0 : 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <svg
                      className={`w-4 h-4 ${isActive ? "text-[#93C5FD]" : "text-[#94A3B8]"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d={link.icon}
                      />
                    </svg>
                    {link.label}
                  </motion.span>
                )}
              </NavLink>
            ))}

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-[#E2E8F0]">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#475569]">
                    Welcome, {user?.email}
                  </span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-medium text-[#475569] hover:text-[#1E3A8A] rounded-xl hover:bg-[#F1F5F9] transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-[#475569] hover:text-[#1E3A8A] rounded-xl hover:bg-[#F1F5F9] transition-all duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-[#1E3A8A] hover:bg-[#1E40AF] rounded-xl shadow-md shadow-[#1E3A8A]/20 hover:shadow-lg hover:shadow-[#1E3A8A]/30 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
            className="md:hidden relative p-2 rounded-xl hover:bg-[#F1F5F9] transition-all duration-300"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <motion.span
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 8 : 0,
                }}
                className="w-full h-0.5 rounded-full bg-[#1E3A8A] origin-center"
              />
              <motion.span
                animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                className="w-full h-0.5 rounded-full bg-[#1E3A8A]"
              />
              <motion.span
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -8 : 0,
                }}
                className="w-full h-0.5 rounded-full bg-[#1E3A8A] origin-center"
              />
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden mt-4"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                className="bg-white rounded-2xl shadow-xl shadow-[#0F172A]/5 border border-[#E2E8F0] p-4 space-y-1"
              >
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                          isActive
                            ? "bg-[#1E3A8A] text-white shadow-md"
                            : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <span className="flex items-center gap-3">
                          <svg
                            className={`w-5 h-5 ${isActive ? "text-[#93C5FD]" : "text-[#94A3B8]"}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d={link.icon}
                            />
                          </svg>
                          {link.label}
                        </span>
                      )}
                    </NavLink>
                  </motion.div>
                ))}

                {/* Mobile Auth Buttons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="pt-3 mt-3 border-t border-[#E2E8F0] space-y-2"
                >
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="px-4 py-2 text-sm text-[#475569] text-center">
                        Welcome, {user?.email}
                      </div>
                      <button
                        onClick={logout}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-[#475569] text-sm font-medium rounded-xl hover:bg-[#F8FAFC] transition-all"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-[#475569] text-sm font-medium rounded-xl hover:bg-[#F8FAFC] transition-all"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#1E3A8A] text-white text-sm font-medium rounded-xl shadow-md hover:bg-[#1E40AF] transition-all"
                      >
                        Get Started
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </Link>
                    </>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
