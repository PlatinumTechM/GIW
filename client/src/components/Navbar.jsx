import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Diamond,
  Menu,
  X,
  UserCircle,
  LogOut,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Home as HomeIcon,
  Gem,
  ShoppingBag,
  CreditCard,
  PhoneCall,
  Sparkles,
  Users,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { notificationAPI } from "@/services/api";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isJoinDropdownOpen, setIsJoinDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // Initialize to 0

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Fetch unread notification count if authenticated
    if (isAuthenticated && user?.role !== "admin") {
      fetchUnreadCount();

      // Implement polling for real-time updates (every 30 seconds)
      const interval = setInterval(fetchUnreadCount, 30000);

      // Refresh when tab becomes visible again
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          fetchUnreadCount();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        clearInterval(interval);
      };
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAuthenticated, user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      if (response.success) {
        // Correcting data mapping: backend returns { success: true, data: { count: X } }
        setUnreadCount(response.data?.count || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getNavLinks = () => {
    const hasActiveSubscription = user?.subscriptionStatus === "active";
    const role = user?.role || "Buyer";

    // Base links
    const links = [];

    // Home is only for non-sellers or non-authenticated users
    if (!isAuthenticated || role !== "Seller") {
      const homePath = isAuthenticated ? `/${role.toLowerCase()}/home` : "/";
      links.push({ path: homePath, label: "Home", Icon: HomeIcon });

      // Add Pricing for public users
      if (!isAuthenticated) {
        links.push({ path: "/pricing", label: "Plans", Icon: CreditCard });
      }
    }

    // Role-specific links
    if (isAuthenticated) {
      const rolePath = role.toLowerCase();
      if (role === "Seller") {
        links.push(
          { path: `/${rolePath}/diamond`, label: "Diamond", Icon: Gem },
          { path: `/${rolePath}/jewellery`, label: "Jewellery", Icon: ShoppingBag },
          { path: `/${rolePath}/pricing`, label: "Plans", Icon: CreditCard }
        );
      }
      // Buyers only get Home and Contact (added below)
    }

    // Contact is for everyone
    links.push({ path: "/contact", label: "Contact", Icon: PhoneCall });

    if (role === "admin") {
      return []; // Admin links are in the dropdown
    }
    return links;
  };

  return (
    <nav
      className={`relative left-0 right-0 z-[1000] transition-all duration-300 border-b border-gray-100/50 py-3 ${isScrolled
        ? "bg-white/40 backdrop-blur-2xl shadow-lg shadow-black/5"
        : "bg-white/10 backdrop-blur-md"
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
              <span className="text-xl font-black tracking-tighter text-[#0F172A] leading-none">GIW</span>
              <span className="text-[10px] font-bold text-[#2e7c9e] uppercase tracking-[0.2em] mt-0.5">Diamond Exchange</span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Pill Shape */}
          <div className="hidden lg:flex items-center gap-1 p-1 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm">
            {getNavLinks().map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2.5 group relative ${isActive
                    ? "text-white bg-[#2e7c9e] shadow-md shadow-[#2e7c9e]/20"
                    : "text-[#475569] hover:text-[#2e7c9e] hover:bg-white/50"
                  }`
                }
              >
                <link.Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>

          {/* User & Actions Area */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                {user?.role !== "admin" && (
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
                )}

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
              <div className="hidden lg:flex items-center gap-4">
                <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-[#475569] hover:text-[#2e7c9e] transition-colors">Sign In</Link>

                {/* Get Started Dropdown */}
                <div className="relative" onMouseEnter={() => setIsJoinDropdownOpen(true)} onMouseLeave={() => setIsJoinDropdownOpen(false)}>
                  <button className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2">
                    <span>Get Started</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isJoinDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isJoinDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(46,124,158,0.08)] z-[1001] overflow-hidden"
                      >
                        <div className="p-2 space-y-1">
                          <Link to="/register?role=Buyer" className="flex items-center gap-3 px-4 py-4 text-sm font-semibold text-[#475569] hover:text-[#2e7c9e] hover:bg-[#d9f0fa]/30 rounded-xl transition-all group">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                              <Users className="w-5 h-5 text-[#2e7c9e]" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-[#0F172A]">Join as Buyer</span>
                              <span className="text-[10px] text-gray-400">Explore and purchase diamonds</span>
                            </div>
                          </Link>

                          <Link to="/register?role=Seller" className="flex items-center gap-3 px-4 py-4 text-sm font-semibold text-[#475569] hover:text-[#2e7c9e] hover:bg-[#d9f0fa]/30 rounded-xl transition-all group">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                              <Diamond className="w-5 h-5 text-[#2e7c9e]" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-[#0F172A]">Join as Seller</span>
                              <span className="text-[10px] text-gray-400">List and sell your inventory</span>
                            </div>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2.5 rounded-xl bg-white border border-gray-100 text-[#475569] hover:text-[#2e7c9e] transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-50 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {getNavLinks().map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold transition-all ${location.pathname === link.path
                    ? "text-[#2e7c9e] bg-[#d9f0fa]/30"
                    : "text-[#475569] hover:bg-gray-50"
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <link.Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-4 grid grid-cols-2 gap-3">
                  <Link to="/login" className="flex items-center justify-center px-4 py-4 rounded-2xl text-sm font-bold text-[#475569] bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="flex items-center justify-center px-4 py-4 rounded-2xl text-sm font-bold text-white bg-[#2e7c9e]" onClick={() => setIsMobileMenuOpen(false)}>Join GIW</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
