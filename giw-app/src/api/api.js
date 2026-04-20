const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.75:5000/api/v1"; // Your computer IP - UPDATE if different!

// Validate API_URL is set
if (!API_URL || API_URL === "undefined") {
  console.error("❌ EXPO_PUBLIC_API_URL is not set! Add it to your .env file");
}

// Common headers for API requests
const getHeaders = () => ({
  "Content-Type": "application/json",
});

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  // Remove trailing slash from API_URL and ensure endpoint starts with /
  const baseUrl = API_URL?.replace(/\/$/, "") || "";
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${path}`;
  const config = {
    headers: getHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("❌ API Error:", error.message);
    console.error("   Request URL:", url);
    console.error("   API_URL value:", API_URL);
    throw error;
  }
};

// Auth specific API methods
export const authAPI = {
  login: async (email, password) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  forgotPassword: async (email) => {
    return apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  getCurrentUser: async (token) => {
    return apiRequest("/auth/me", {
      headers: {
        ...getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateProfile: async (profileData, token) => {
    return apiRequest("/auth/profile", {
      method: "PUT",
      headers: {
        ...getHeaders(),
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
  },

  getAllUsers: async (token) => {
    return apiRequest("/admin/users", {
      headers: {
        ...getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });
  },

  verifyAdminPassword: async (password, token) => {
    return apiRequest("/admin/verify-password", {
      method: "POST",
      headers: {
        ...getHeaders(),
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });
  },
};

// Generic API methods for other modules
export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: "GET" }),
  post: (endpoint, data) =>
    apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: (endpoint, data) =>
    apiRequest(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (endpoint) => apiRequest(endpoint, { method: "DELETE" }),
};

export default API_URL;
