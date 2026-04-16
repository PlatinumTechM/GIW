import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
import notify from "../utils/notifications.jsx";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    // Check if user is logged in on app start using cookie
    const checkAuth = async () => {
      try {
        // Fetch user data from API - cookie will be sent automatically
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
        // Store role in localStorage for UI purposes only
        localStorage.setItem("role", userData.role || "user");
        setSessionExpired(false);
      } catch (error) {
        // If API fails (401), user is not logged in
        setUser(null);
        localStorage.removeItem("role");
        // Check if it was a session expiration (401 with existing role)
        if (error.response?.status === 401 && localStorage.getItem("role")) {
          setSessionExpired(true);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (identifier, password) => {
    try {
      const response = await authAPI.login(identifier, password);
      const { user: userData } = response;

      // Token is stored in httpOnly cookie by backend
      // Only store role in localStorage for UI purposes
      localStorage.setItem("role", userData.role || "user");
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response);
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed",
      };
    }
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    setSessionExpired(false);
    localStorage.removeItem("role");
    notify.info("Logged Out", "You have been successfully logged out");
  };

  // Handle session expiration - call this when 401 received in protected routes
  const handleSessionExpired = () => {
    setUser(null);
    setSessionExpired(true);
    localStorage.removeItem("role");
  };

  // Clear session expired flag (call on login page mount)
  const clearSessionExpired = () => {
    setSessionExpired(false);
  };

  const value = {
    user,
    setUser,
    login,
    register,
    logout,
    handleSessionExpired,
    clearSessionExpired,
    isAuthenticated: !!user,
    loading,
    sessionExpired,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
