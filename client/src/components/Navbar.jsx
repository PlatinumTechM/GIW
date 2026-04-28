import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { notificationAPI } from "../services/api.js";
import {
  Diamond,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Bell,
  Home as HomeIcon,
  Gem,
  ShoppingBag,
  CreditCard,
  PhoneCall,
  Settings,
  UserCircle
} from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    await logout();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await notificationAPI.getUnreadCount();
      setUnreadCount(response.data?.count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  }, [location]);

  const getNavLinks = () => {
    const hasActiveSubscription = user?.subscriptionStatus === "active";
    const links = [
      { path: isAuthenticated ? "/user/home" : "/", label: "Home", Icon: HomeIcon },
      isAuthenticated ? { path: "/user/add-stock", label: "Diamond", Icon: Gem } : null,
      isAuthenticated ? { path: "/user/jewellery-stock", label: "Jewellery", Icon: ShoppingBag } : null,
      !hasActiveSubscription ? { path: "/pricing", label: "Pricing", Icon: CreditCard } : null,
      { path: "/contact", label: "Contact", Icon: PhoneCall },
    ].filter(Boolean);

    if (user?.role === "admin") {
      return links.filter(link => !["Home", "Diamond", "Jewellery", "Pricing", "Contact"].includes(link.label));
    }
    return links;
  };

  const navLinks = getNavLinks();
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(location.pathname);
  if (isAuthPage) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${isScrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(46,124,158,0.05)] py-2"
          : "bg-transparent py-3"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group relative">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2e7c9e] to-[#4aa3c7] rounded-xl flex items-center justify-center shadow-lg shadow-[#2e7c9e]/10 transition-transform group-hover:rotate-12 group-hover:scale-110 duration-300">
                <Diamond className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-[#2e7c9e]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-[#0F172A] tracking-tighter leading-none">GIW</span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#2e7c9e]">Diamond Exchange</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100/50 backdrop-blur-sm p-1.5 rounded-2xl border border-white/50">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2.5 group relative ${isActive
                    ? "text-white bg-[#2e7c9e] shadow-lg shadow-[#2e7c9e]/10"
                    : "text-[#475569] hover:text-[#2e7c9e] hover:bg-white"
                  }`
                }
              >
                <link.Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${location.pathname === link.path ? 'text-white' : 'text-[#2e7c9e]'}`} />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>

          {/* User & Actions Area */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <Link
                  to="/notifications"
                  className="relative w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#475569] hover:text-[#2e7c9e] hover:border-[#2e7c9e]/30 hover:bg-[#d9f0fa]/30 transition-all group"
                  onClick={() => setUnreadCount(0)}
                >
                  <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center bg-red-500 text-[10px] font-bold text-white rounded-full border-2 border-white ring-2 ring-red-500/20">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative ml-1" onMouseEnter={() => setIsUserDropdownOpen(true)} onMouseLeave={() => setIsUserDropdownOpen(false)}>
                  <button className="flex items-center gap-3 p-1 pr-3 rounded-2xl bg-white border border-gray-100 hover:border-[#2e7c9e]/30 transition-all group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2e7c9e] to-[#4aa3c7] flex items-center justify-center text-white text-sm font-black shadow-md shadow-[#2e7c9e]/10">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="text-xs font-bold text-[#0F172A] leading-tight max-w-[100px] truncate">
                        {user?.name || "Dealer"}
                      </span>
                      <span className="text-[9px] font-semibold text-[#2e7c9e] uppercase tracking-wider">
                        {user?.role || "Business"}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#475569] transition-transform duration-300 ${isUserDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(46,124,158,0.08)] z-[1001] overflow-hidden"
                      >
                        <div className="px-5 py-5 bg-gradient-to-br from-[#d9f0fa]/50 to-white border-b border-gray-50">
                          <p className="text-[10px] font-bold text-[#2e7c9e] uppercase tracking-widest mb-1">Authenticated Account</p>
                          <p className="text-sm font-bold text-[#0F172A] truncate">{user?.email}</p>
                        </div>

                        <div className="p-2 space-y-1"> 
                          {user?.role === "admin" && (
                            <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#475569] hover:text-[#2e7c9e] hover:bg-[#d9f0fa]/30 rounded-xl transition-all group">
                              <LayoutDashboard className="w-4 h-4 text-[#2e7c9e]" />
                              <span>Admin Dashboard</span>
                            </Link>
                          )}

                          <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#475569] hover:text-[#2e7c9e] hover:bg-[#d9f0fa]/30 rounded-xl transition-all group">
                            <UserCircle className="w-4 h-4 text-[#2e7c9e]" />
                            <span>My Profile</span>
                          </Link>

                          {/* <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#475569] hover:text-[#2e7c9e] hover:bg-[#d9f0fa]/30 rounded-xl transition-all group">
                            <Settings className="w-4 h-4 text-[#2e7c9e]" />
                            <span>Settings</span>
                          </Link> */}

                          <div className="h-px bg-gray-50 mx-3 my-2" />

                          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all group">
                            <LogOut className="w-4 h-4 text-red-500" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-[#475569] hover:text-[#2e7c9e] transition-colors">Sign In</Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-[#2e7c9e] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#2e7c9e]/10 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
                >
                  Join Now
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-white border border-gray-100 text-[#2e7c9e] flex items-center justify-center transition-all active:scale-95"
            >
              <div className="w-5 h-4 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-50 overflow-hidden shadow-2xl"
          >
            <div className="p-4 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-4 p-4 rounded-2xl text-sm font-bold transition-all ${isActive
                      ? "text-[#2e7c9e] bg-[#d9f0fa]/40 border border-[#2e7c9e]/10"
                      : "text-[#475569] hover:bg-gray-50"
                    }`
                  }
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${location.pathname === link.path ? 'bg-white shadow-sm text-[#2e7c9e]' : 'bg-gray-100 text-[#475569]'}`}>
                    <link.Icon className="w-5 h-5" />
                  </div>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
