const API_URL = process.env.EXPO_PUBLIC_API_URL; // backend IP

// Common headers for API requests
const getHeaders = () => ({
  "Content-Type": "application/json",
});

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
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
    console.error("API Error:", error);
    throw error;
  }
};

// Auth specific API methods
export const authAPI = {
  login: async (email, password) => {
    return apiRequest("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData) => {
    return apiRequest("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  forgotPassword: async (email) => {
    return apiRequest("/api/v1/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  getCurrentUser: async (token) => {
    return apiRequest("/api/v1/auth/me", {
      headers: {
        ...getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateProfile: async (profileData, token) => {
    return apiRequest("/api/v1/auth/profile", {
      method: "PUT",
      headers: {
        ...getHeaders(),
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
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
