import { Platform } from "react-native";
import SecureStore from "expo-secure-store";

// Secure storage keys
const STORAGE_KEYS = {
  TOKEN: "user_token",
  USER_DATA: "user_data",
  ROLE: "user_role",
};

// Simple in-memory storage for fallback
const memoryStorage = {
  data: {},
  setItem: async (key, value) => {
    try {
      memoryStorage.data[key] = value;
      return true;
    } catch (error) {
      console.error("MemoryStorage error:", error);
      return false;
    }
  },
  getItem: async (key) => {
    try {
      const value = memoryStorage.data[key] || null;
      return value;
    } catch (error) {
      console.error("MemoryStorage error:", error);
      return null;
    }
  },
  deleteItem: async (key) => {
    try {
      delete memoryStorage.data[key];
      return true;
    } catch (error) {
      console.error("MemoryStorage error:", error);
      return false;
    }
  },
  clearAll: async () => {
    try {
      memoryStorage.data = {};
      return true;
    } catch (error) {
      console.error("MemoryStorage error:", error);
      return false;
    }
  },
};

// Web storage fallback
const webStorage = {
  setItem: (key, value) => {
    try {
      if (typeof localStorage !== "undefined" && localStorage.setItem) {
        localStorage.setItem(key, value);
        return true;
      } else {
        console.warn(
          "localStorage not available, using memory storage fallback",
        );
        return memoryStorage.setItem(key, value);
      }
    } catch (error) {
      console.error("Web storage error:", error);
      return memoryStorage.setItem(key, value);
    }
  },
  getItem: (key) => {
    try {
      if (typeof localStorage !== "undefined" && localStorage.getItem) {
        return localStorage.getItem(key);
      } else {
        console.warn(
          "localStorage not available, using memory storage fallback",
        );
        return memoryStorage.getItem(key);
      }
    } catch (error) {
      console.error("Web storage error:", error);
      return memoryStorage.getItem(key);
    }
  },
  deleteItem: (key) => {
    try {
      if (typeof localStorage !== "undefined" && localStorage.removeItem) {
        localStorage.removeItem(key);
        return true;
      } else {
        console.warn(
          "localStorage not available, using memory storage fallback",
        );
        return memoryStorage.deleteItem(key);
      }
    } catch (error) {
      console.error("Web storage error:", error);
      return memoryStorage.deleteItem(key);
    }
  },
};

// Secure storage utility functions
export const secureStorage = {
  // Store authentication token securely
  setToken: async (token) => {
    try {
      // Try SecureStore first (if available on mobile)
      if (Platform.OS !== "web") {
        try {
          await SecureStore.setItem(STORAGE_KEYS.TOKEN, token);

          // Verify immediately after SecureStore
          const verifySecure = await SecureStore.getItem(STORAGE_KEYS.TOKEN);

          if (!verifySecure) {
            console.warn(
              "SecureStore token verification failed, using memory storage fallback",
            );
            await memoryStorage.setItem(STORAGE_KEYS.TOKEN, token);
          }
        } catch (secureError) {
          console.warn(
            "SecureStore token failed, using memory storage fallback:",
            secureError,
          );
          await memoryStorage.setItem(STORAGE_KEYS.TOKEN, token);
        }
      } else {
        // Web platform - use localStorage or memory storage
        await webStorage.setItem(STORAGE_KEYS.TOKEN, token);
      }

      // Final verification
      const finalVerify = await memoryStorage.getItem(STORAGE_KEYS.TOKEN);

      return true;
    } catch (error) {
      console.error("Error storing token:", error);
      return false;
    }
  },

  // Get authentication token securely
  getToken: async () => {
    try {
      if (Platform.OS !== "web") {
        try {
          const token = await SecureStore.getItem(STORAGE_KEYS.TOKEN);
          if (token) {
            return token;
          } else {
            console.warn(
              "SecureStore returned null, using memory storage fallback",
            );
            return await memoryStorage.getItem(STORAGE_KEYS.TOKEN);
          }
        } catch (secureError) {
          console.warn(
            "SecureStore failed, using memory storage fallback:",
            secureError,
          );
          return await memoryStorage.getItem(STORAGE_KEYS.TOKEN);
        }
      } else {
        // Web platform - use localStorage or memory storage
        return await webStorage.getItem(STORAGE_KEYS.TOKEN);
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  },

  // Store user data securely
  setUserData: async (userData) => {
    try {
      const userDataString = JSON.stringify(userData);

      // Try SecureStore first (if available on mobile)
      if (Platform.OS !== "web") {
        try {
          await SecureStore.setItem(STORAGE_KEYS.USER_DATA, userDataString);

          // Verify immediately after SecureStore
          const verifySecure = await SecureStore.getItem(
            STORAGE_KEYS.USER_DATA,
          );

          if (!verifySecure) {
            console.warn(
              "SecureStore verification failed, using memory storage fallback",
            );
            await memoryStorage.setItem(STORAGE_KEYS.USER_DATA, userDataString);
          }
        } catch (secureError) {
          console.warn(
            "SecureStore failed, using memory storage fallback:",
            secureError,
          );
          await memoryStorage.setItem(STORAGE_KEYS.USER_DATA, userDataString);
        }
      } else {
        // Web platform - use localStorage or memory storage
        await webStorage.setItem(STORAGE_KEYS.USER_DATA, userDataString);
      }

      // Final verification
      const finalVerify = await memoryStorage.getItem(STORAGE_KEYS.USER_DATA);
      return true;
    } catch (error) {
      console.error("Error storing user data:", error);
      return false;
    }
  },

  // Get user data securely
  getUserData: async () => {
    try {
      if (Platform.OS !== "web") {
        try {
          const userDataString = await SecureStore.getItem(
            STORAGE_KEYS.USER_DATA,
          );
          if (!userDataString) {
            return null;
          }

          try {
            const userData = JSON.parse(userDataString);
            return userData;
          } catch (parseError) {
            console.error("Error parsing user data:", parseError);
            return null;
          }
        } catch (secureError) {
          console.warn(
            "SecureStore failed, using memory storage fallback:",
            secureError,
          );
          const userDataString = await memoryStorage.getItem(
            STORAGE_KEYS.USER_DATA,
          );

          if (!userDataString) {
            return null;
          }

          try {
            const userData = JSON.parse(userDataString);
            return userData;
          } catch (parseError) {
            console.error("Error parsing user data from memory:", parseError);
            return null;
          }
        }
      } else {
        // Web platform - use localStorage or memory storage
        const userDataString = await webStorage.getItem(STORAGE_KEYS.USER_DATA);
        if (!userDataString) {
          return null;
        }

        try {
          const userData = JSON.parse(userDataString);
          return userData;
        } catch (parseError) {
          console.error("Error parsing user data:", parseError);
          return null;
        }
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
      return null;
    }
  },

  // Store user role securely
  setRole: async (role) => {
    try {
      if (Platform.OS !== "web") {
        try {
          await SecureStore.setItem(STORAGE_KEYS.ROLE, role);
        } catch (secureError) {
          console.warn(
            "SecureStore role failed, using memory storage fallback:",
            secureError,
          );
          await memoryStorage.setItem(STORAGE_KEYS.ROLE, role);
        }
      } else {
        // Web platform - use localStorage or memory storage
        await webStorage.setItem(STORAGE_KEYS.ROLE, role);
      }
      return true;
    } catch (error) {
      console.error("Error storing role:", error);
      return false;
    }
  },

  // Get user role securely
  getRole: async () => {
    try {
      if (Platform.OS !== "web") {
        try {
          const role = await SecureStore.getItem(STORAGE_KEYS.ROLE);
          return role;
        } catch (secureError) {
          console.warn(
            "SecureStore failed, using memory storage fallback:",
            secureError,
          );
          return await memoryStorage.getItem(STORAGE_KEYS.ROLE);
        }
      } else {
        // Web platform - use localStorage or memory storage
        return await webStorage.getItem(STORAGE_KEYS.ROLE);
      }
    } catch (error) {
      console.error("Error retrieving role:", error);
      return null;
    }
  },

  // Remove authentication token securely
  removeToken: async () => {
    try {
      if (Platform.OS !== "web") {
        try {
          await SecureStore.deleteItem(STORAGE_KEYS.TOKEN);
        } catch (secureError) {
          console.warn(
            "SecureStore failed, using memory storage fallback:",
            secureError,
          );
          await memoryStorage.deleteItem(STORAGE_KEYS.TOKEN);
        }
      } else {
        // Web platform - use localStorage or memory storage
        await webStorage.deleteItem(STORAGE_KEYS.TOKEN);
      }
      return true;
    } catch (error) {
      console.error("Error removing token:", error);
      return false;
    }
  },

  // Remove user data securely
  removeUserData: async () => {
    try {
      if (Platform.OS !== "web") {
        try {
          await SecureStore.deleteItem(STORAGE_KEYS.USER_DATA);
        } catch (secureError) {
          console.warn(
            "SecureStore failed, using memory storage fallback:",
            secureError,
          );
          await memoryStorage.deleteItem(STORAGE_KEYS.USER_DATA);
        }
      } else {
        // Web platform - use localStorage or memory storage
        await webStorage.deleteItem(STORAGE_KEYS.USER_DATA);
      }
      return true;
    } catch (error) {
      console.error("Error removing user data:", error);
      return false;
    }
  },

  // Remove user role securely
  removeRole: async () => {
    try {
      if (Platform.OS !== "web") {
        try {
          await SecureStore.deleteItem(STORAGE_KEYS.ROLE);
        } catch (secureError) {
          console.warn(
            "SecureStore role failed, using memory storage fallback:",
            secureError,
          );
          await memoryStorage.deleteItem(STORAGE_KEYS.ROLE);
        }
      } else {
        // Web platform - use localStorage or memory storage
        await webStorage.deleteItem(STORAGE_KEYS.ROLE);
      }
      return true;
    } catch (error) {
      console.error("Error removing role:", error);
      return false;
    }
  },

  // Clear all authentication data securely
  clearAll: async () => {
    try {
      if (Platform.OS !== "web") {
        try {
          const SecureStore = require("expo-secure-store").default;
          await Promise.all([
            SecureStore.deleteItem(STORAGE_KEYS.TOKEN),
            SecureStore.deleteItem(STORAGE_KEYS.USER_DATA),
            SecureStore.deleteItem(STORAGE_KEYS.ROLE),
          ]);
        } catch (secureError) {
          console.warn(
            "SecureStore clear failed, using memory storage fallback:",
            secureError,
          );
          await memoryStorage.deleteItem(STORAGE_KEYS.TOKEN);
          await memoryStorage.deleteItem(STORAGE_KEYS.USER_DATA);
          await memoryStorage.deleteItem(STORAGE_KEYS.ROLE);
        }
      } else {
        // Web platform - use localStorage or memory storage
        await webStorage.deleteItem(STORAGE_KEYS.TOKEN);
        await webStorage.deleteItem(STORAGE_KEYS.USER_DATA);
        await webStorage.deleteItem(STORAGE_KEYS.ROLE);
      }

      // Always clear memory storage as well
      await memoryStorage.clearAll();

      return true;
    } catch (error) {
      console.error("Error clearing all data:", error);
      return false;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      if (Platform.OS !== "web") {
        try {
          const SecureStore = require("expo-secure-store").default;
          const token = await SecureStore.getItem(STORAGE_KEYS.TOKEN);
          return token !== null;
        } catch (secureError) {
          console.warn(
            "SecureStore failed, using memory storage fallback:",
            secureError,
          );
          const token = await memoryStorage.getItem(STORAGE_KEYS.TOKEN);
          return token !== null;
        }
      } else {
        // Web platform - use localStorage or memory storage
        const token = await webStorage.getItem(STORAGE_KEYS.TOKEN);
        return token !== null;
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  },
};

export default secureStorage;
