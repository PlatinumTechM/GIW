import axios from "axios";
import notify from "../utils/notifications.jsx";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

// Request interceptor to add API key header
api.interceptors.request.use(
  (config) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (apiKey) {
      config.headers["x-api-key"] = apiKey;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

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
      notify.error(
        "Connection Error",
        "Server is not reachable. Please try again later.",
      );
    }

    // Only handle 401 as session expiration for authenticated users
    const isAuthenticated = !!localStorage.getItem("role");
    if (status === 401 && isAuthenticated && !isLoginRequest && !isVerifyAdminRequest) {
      const errorData = error.response?.data;
      
      if (errorData?.code === "USER_DEACTIVATED") {
        notify.error("Account Deactivated", errorData.message || "Your account has been deactivated.");
        // Force logout
        localStorage.removeItem("role");
        window.location.href = "/login?reason=deactivated";
      } else {
        notify.warning("Session Expired", "Your session has expired. Please login again.");
        // Optionally clear session and redirect
        localStorage.removeItem("role");
        window.location.href = "/login?reason=expired";
      }
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  login: async (identifier, password, rememberMe = false) => {
    const response = await api.post("/auth/login", {
      email: identifier,
      password,
      rememberMe,
    });
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

  // Public subscription endpoint for pricing page (no auth required)
  getPublicSubscriptions: async () => {
    const response = await api.get("/admin/subscriptions/public");
    return response.data;
  },

  // Subscription management (admin only)
  getSubscriptions: async () => {
    const response = await api.get("/admin/subscriptions");
    return response.data;
  },

  createSubscription: async (data) => {
    const response = await api.post("/admin/subscriptions", data);
    return response.data;
  },

  updateSubscription: async (id, data) => {
    const response = await api.put(`/admin/subscriptions/${id}`, data);
    return response.data;
  },

  deleteSubscription: async (id) => {
    const response = await api.delete(`/admin/subscriptions/${id}`);
    return response.data;
  },

  // User subscription purchase
  purchaseSubscription: async (planId, durationMonths) => {
    const response = await api.post("/auth/purchase-subscription", {
      planId,
      durationMonths,
    });
    return response.data;
  },

  // Get all subscription buyers (admin only)
  getSubscriptionBuyers: async () => {
    const response = await api.get("/admin/subscription-buyers");
    return response.data;
  },

  // Update user plan (admin only)
  updateUserPlan: async (userId, planId, durationMonths) => {
    const response = await api.put(`/admin/users/${userId}/plan`, {
      planId,
      durationMonths,
    });
    return response.data;
  },
  // Update user status (admin only)
  updateUserStatus: async (userId, isActive) => {
    const response = await api.put(`/admin/users/${userId}/status`, {
      isActive,
    });
    return response.data;
  },
};

export const notificationAPI = {
  getAllNotifications: async (filters = {}) => {
    const response = await api.get("/notifications", { params: filters });
    return response.data;
  },

  createNotification: async (notificationData) => {
    const response = await api.post("/notifications", notificationData);
    return response.data;
  },

  getAllUsersForNotification: async () => {
    const response = await api.get("/notifications/users");
    return response.data;
  },

  getNotificationById: async (id) => {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  },

  updateNotification: async (id, notificationData) => {
    const response = await api.put(`/notifications/${id}`, notificationData);
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch("/notifications/mark-all-read");
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get("/notifications/unread-count");
    return response.data;
  },
};

export const stockAPI = {
  getAllStocks: async (params = {}) => {
    const response = await api.get("/stock", { params });
    return response.data;
  },

  getNaturalDiamonds: async (params = {}) => {
    const response = await api.get("/stock/natural", { params });
    return response.data;
  },

  getLabGrownDiamonds: async (params = {}) => {
    const response = await api.get("/stock/lab-grown", { params });
    return response.data;
  },

  getStockById: async (id) => {
    const response = await api.get(`/stock/${id}`);
    return response.data;
  },

  bulkUpload: async (stockData) => {
    const response = await api.post("/stock/bulk", { stock: stockData });
    return response.data;
  },

  createStock: async (stockData) => {
    const response = await api.post("/stock", stockData);
    return response.data;
  },

  updateStock: async (id, stockData) => {
    const response = await api.put(`/stock/${id}`, stockData);
    return response.data;
  },

  deleteStock: async (id) => {
    const response = await api.delete(`/stock/${id}`);
    return response.data;
  },

  getMyStocks: async (params = {}) => {
    const response = await api.get("/stock/my", { params });
    return response.data;
  },

  getFieldMapping: async () => {
    const response = await api.get("/stock/fields/mapping");
    return response.data;
  },
};

export const jewelryAPI = {
  getNaturalJewelry: async (params = {}) => {
    const response = await api.get("/jewellry-stock/natural", { params });
    return response.data;
  },

  getLabGrownJewelry: async (params = {}) => {
    const response = await api.get("/jewellry-stock/lab-grown", { params });
    return response.data;
  },

  getJewelryById: async (id) => {
    const response = await api.get(`/jewellry-stock/public/${id}`);
    return response.data;
  },

  getJewelryFilters: async () => {
    const response = await api.get("/jewellry-stock/public/filters");
    return response.data;
  },
};

export default api;
