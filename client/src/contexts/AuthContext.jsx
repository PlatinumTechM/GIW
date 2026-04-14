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

  useEffect(() => {
    // Check if user is logged in on app start using cookie
    const checkAuth = async () => {
      try {
        // Fetch user data from API - cookie will be sent automatically
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
        // Store role in localStorage for UI purposes only
        localStorage.setItem("role", userData.role || "user");
      } catch (error) {
        // If API fails (401), user is not logged in
        setUser(null);
        localStorage.removeItem("role");
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
    localStorage.removeItem("role");
    notify.info("Logged Out", "You have been successfully logged out");
  };

  const value = {
    user,
    setUser,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
