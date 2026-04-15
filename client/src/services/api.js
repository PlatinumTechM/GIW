import axios from "axios";
import notify from "../utils/notifications.jsx";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isLoginRequest = url.includes("/auth/login");
    const isVerifyAdminRequest = url.includes("/admin/verify-password");
    const status = error.response?.status;

    // Handle 404 - API endpoint not found
    if (status === 404) {
      notify.error("Connection Error", "Server is not reachable. Please try again later.");
    }

    // Only handle 401 as session expiration if NOT on login or verify-admin requests
    if (status === 401 && !isLoginRequest && !isVerifyAdminRequest) {
      notify.warning("Please try again.. Session Expired.");
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  login: async (identifier, password) => {
    const response = await api.post("/auth/login", { email: identifier, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  logout: async () => {
    try {
      // Call backend logout API to clear httpOnly cookie
      await api.post("/auth/logout");
    } catch (error) {
      // Silently fail
      console.error("Logout API error:", error);
    }
    // Clear role from localStorage
    localStorage.removeItem("role");
  },

  checkAuth: async () => {
    try {
      await api.get("/auth/me");
      return true;
    } catch {
      return false;
    }
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put("/auth/profile", userData);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  verifyAdminPassword: async (password) => {
    const response = await api.post("/admin/verify-password", { password });
    return response.data;
  },
};

export default api;
