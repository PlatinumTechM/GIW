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
    // Check if user is logged in on app start
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Fetch fresh user data from API
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
        // Only store role in localStorage
        localStorage.setItem("role", userData.role || "user");
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // If API fails, we don't have user data
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener('storage', () => checkAuth());
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const login = async (identifier, password) => {
    try {
      const response = await authAPI.login(identifier, password);
      const { token, user: userData } = response;

      if (!token) {
        console.error("No token in response");
        return { success: false, error: "No token received from server" };
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", userData.role || "user");
      localStorage.setItem("user", JSON.stringify(userData));
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

  const logout = () => {
    authAPI.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
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
