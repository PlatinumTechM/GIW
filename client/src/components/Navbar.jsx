import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
    { path: "/pricing", label: "Pricing", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { path: "/contact", label: "Contact", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { path: "/admin", label: "Admin", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
    { path: "/login", label: "Login", icon: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" },
    { path: "/register", label: "Register", icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" },
  ];

  // Check if we're on auth pages (Login, Register, ForgotPassword) to hide navbar
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(location.pathname);
  if (isAuthPage) return null;

  // Pages with light backgrounds should always use dark text
  const lightPages = ["/", "/pricing", "/contact"];
  const isLightPage = lightPages.includes(location.pathname);
  const useDarkText = isScrolled || isLightPage;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-900/5 py-3"
          : "bg-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 ${isScrolled
                  ? "bg-gradient-to-br from-slate-100 to-slate-300"
                  : "bg-gradient-to-br from-slate-100 to-slate-300"
                }`}>
                <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${useDarkText ? "text-slate-900" : "text-white"
                }`}>
                GIW
              </span>
              <span className={`text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${useDarkText ? "text-slate-500" : "text-slate-400"
                }`}>
                Diamond Exchange
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${isActive
                    ? useDarkText
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-900"
                    : useDarkText
                      ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="flex items-center gap-2">
                    <svg
                      className={`w-4 h-4 ${isActive
                          ? useDarkText
                            ? "text-slate-300"
                            : "text-slate-500"
                          : useDarkText
                            ? "text-slate-400"
                            : "text-slate-400"
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                    </svg>
                    {link.label}
                  </span>
                )}
              </NavLink>
            ))}

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden relative p-2 rounded-xl transition-all duration-300 ${useDarkText ? "hover:bg-slate-100" : "hover:bg-white/10"
              }`}
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={`w-full h-0.5 rounded-full transition-all duration-300 origin-center ${isMobileMenuOpen
                    ? "rotate-45 translate-y-2 bg-slate-900"
                    : useDarkText
                      ? "bg-slate-700"
                      : "bg-white"
                  }`}
              />
              <span
                className={`w-full h-0.5 rounded-full transition-all duration-300 ${isMobileMenuOpen ? "opacity-0 scale-0" : useDarkText ? "bg-slate-700" : "bg-white"
                  }`}
              />
              <span
                className={`w-full h-0.5 rounded-full transition-all duration-300 origin-center ${isMobileMenuOpen
                    ? "-rotate-45 -translate-y-2 bg-slate-900"
                    : useDarkText
                      ? "bg-slate-700"
                      : "bg-white"
                  }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
            }`}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100 p-4 space-y-2">
            {navLinks.map((link, index) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                    ? "bg-slate-900 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {({ isActive }) => (
                  <span className="flex items-center gap-3">
                    <svg
                      className={`w-5 h-5 ${isActive ? "text-slate-300" : "text-slate-400"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                    </svg>
                    {link.label}
                  </span>
                )}
              </NavLink>
            ))}

            {/* Mobile CTA */}
            <div className="pt-2 border-t border-slate-100">
              <NavLink
                to="/register"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl shadow-lg"
              >
                <span>Get Started</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
