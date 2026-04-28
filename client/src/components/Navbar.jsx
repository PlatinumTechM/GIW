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
  const [isJoinDropdownOpen, setIsJoinDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const joinDropdownRef = useRef(null);
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
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      if (joinDropdownRef.current && !joinDropdownRef.current.contains(event.target)) {
        setIsJoinDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const getNavLinks = () => {
    const hasActiveSubscription = user?.subscriptionStatus === "active";
    const links = [
      { path: isAuthenticated ? "/user/home" : "/", label: "Home", Icon: HomeIcon },
      isAuthenticated ? { path: "/user/add-stock", label: "Diamond", Icon: Gem } : null,
      isAuthenticated ? { path: "/user/jewellery-stock", label: "Jewellery", Icon: ShoppingBag } : null,
      !hasActiveSubscription ? { path: "/pricing", label: "Pricing", Icon: CreditCard } : null,
      { path: "/contact", label: "Contact", Icon: PhoneCall },
    ].filter(Boolean);

      {
        path: isAuthenticated ? "/user/home" : "/",
        label: "Home",
        icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      },
      isAuthenticated && user?.role === "Seller"
        ? {
          path: "user/add-stock",
          label: "Diamond",
          icon: "M12 3L2 12l10 9 10-9-10-9z",
        }
        : null,
      isAuthenticated && user?.role === "Seller"
        ? {
          path: "user/jewellery-stock",
          label: "Jewellery",
          icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
        }
        : null,
      // Hide Pricing if user has active subscription
      !hasActiveSubscription
        ? {
          path: "/pricing",
          label: "Pricing",
          icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 01118 0z",
        }
        : null,
      {
        path: "/contact",
        label: "Contact",
        icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      },
    ].filter(Boolean);
    // Hide Home, Stock, Pricing, Contact for admin users - only show Dashboard in dropdown
    if (user?.role === "admin") {
      return links.filter(link => !["Home", "Diamond", "Jewellery", "Pricing", "Contact"].includes(link.label));
    }

    // Hide Home and Contact for Seller users - only show Diamond and Jewellery
    if (user?.role === "Seller") {
      return links.filter(
        (link) =>
          link.label !== "Home" &&
          link.label !== "Pricing" &&
          link.label !== "Contact",
      );
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
                          {/* User Info Header */}
                          <div className="px-4 py-3 bg-gradient-to-r from-[#F8FAFC] to-white border-b border-[#E2E8F0]">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#B8860B] p-[2px]">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center">
                                  <span className="text-white text-sm font-semibold">
                                    {user?.name?.charAt(0)?.toUpperCase() ||
                                      user?.email?.charAt(0)?.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#0F172A] truncate">
                                  {user?.name || "Valued Customer"}
                                </p>
                                <div className="flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-[#FFD700]" />
                                  <p className="text-xs text-[#94A3B8] truncate">
                                    {user?.email}
                                  </p>
                                </div>
                                <div className="mt-1">
                                  <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                                    user?.role === 'Seller' 
                                      ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20'
                                      : user?.role === 'admin'
                                      ? 'bg-[#1E3A8A]/10 text-[#1E3A8A] border border-[#1E3A8A]/20'
                                      : 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20'
                                  }`}>
                                    {user?.role || 'Buyer'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
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
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-[#475569] hover:text-[#1E3A8A] rounded-xl hover:bg-[#F1F5F9] transition-all duration-300"
                  >
                    Sign In
                  </Link>
                  <div className="relative" ref={joinDropdownRef}>
                    <button
                      onClick={() => setIsJoinDropdownOpen(!isJoinDropdownOpen)}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#1E3A8A] hover:bg-[#1E40AF] rounded-xl shadow-md shadow-[#1E3A8A]/20 hover:shadow-lg hover:shadow-[#1E3A8A]/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      Get Started
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isJoinDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {isJoinDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl shadow-[#0F172A]/15 border border-[#E2E8F0] py-2 z-[1001] overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700]"></div>
                          <div className="p-2 space-y-1">
                            <Link
                              to="/register?role=Buyer"
                              onClick={() => setIsJoinDropdownOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#475569] hover:text-[#1E3A8A] hover:bg-gradient-to-r hover:from-[#1E3A8A]/5 hover:to-transparent rounded-xl transition-all duration-200 group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center group-hover:bg-[#1E3A8A]/20 transition-colors">
                                <User className="w-4 h-4" />
                              </div>
                              <span className="font-medium">Join as Buyer</span>
                            </Link>
                            <Link
                              to="/register?role=Seller"
                              onClick={() => setIsJoinDropdownOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#475569] hover:text-[#1E3A8A] hover:bg-gradient-to-r hover:from-[#1E3A8A]/5 hover:to-transparent rounded-xl transition-all duration-200 group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center group-hover:bg-[#1E3A8A]/20 transition-colors">
                                <Package className="w-4 h-4" />
                              </div>
                              <span className="font-medium">Join as Seller</span>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      {/* Notification Link - Mobile */}
                      <NavLink
                        to="/notifications"
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            isActive
                              ? "bg-[#1E3A8A] text-white shadow-md"
                              : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                          }`
                        }
                        onClick={() => setUnreadCount(0)}
                      >
                        <div className="relative">
                          <Bell className="w-5 h-5" />
                          {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                          )}
                        </div>
                        Notifications
                      </NavLink>

                      {/* Admin Dashboard Link - Only for admin */}
                      {user?.role === "admin" && (
                        <NavLink
                          to="/admin"
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                              ? "bg-[#1E3A8A] text-white shadow-md"
                              : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                            }`
                          }
                        >
                          <svg
                            className={`w-5 h-5 ${({ isActive }) => (isActive ? "text-[#93C5FD]" : "text-[#94A3B8]")}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                            />
                          </svg>
                          Dashboard
                        </NavLink>
                      )}
                      {/* Profile Button */}
                      <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                            ? "bg-[#1E3A8A] text-white shadow-md"
                            : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                          }`
                        }
                      >
                        <svg
                          className={`w-5 h-5 ${({ isActive }) => (isActive ? "text-[#93C5FD]" : "text-[#94A3B8]")}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile
                      </NavLink>
                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition-all"
                      >
                        <svg
                          className="w-5 h-5 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="flex items-center gap-3 px-4 py-3 text-[#475569] text-sm font-medium rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A] transition-all"
                      >
                        <svg
                          className="w-5 h-5 text-[#94A3B8]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign In
                      </Link>
                      <div className="space-y-2">
                        <Link
                          to="/register?role=Buyer"
                          className="flex items-center gap-3 px-4 py-3 bg-[#1E3A8A] text-white text-sm font-medium rounded-xl shadow-md hover:bg-[#1E40AF] transition-all"
                        >
                          <svg
                            className="w-5 h-5 text-[#93C5FD]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Join as Buyer
                        </Link>
                        <Link
                          to="/register?role=Seller"
                          className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white text-sm font-medium rounded-xl shadow-md hover:from-[#1E40AF] hover:to-[#2563EB] transition-all"
                        >
                          <svg
                            className="w-5 h-5 text-[#93C5FD]"
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
                          Join as Seller
                        </Link>
                      </div>
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
