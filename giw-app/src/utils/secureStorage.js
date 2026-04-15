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
      console.log("MemoryStorage: Data stored successfully for key:", key);
      return true;
    } catch (error) {
      console.error("MemoryStorage error:", error);
      return false;
    }
  },
  getItem: async (key) => {
    try {
      const value = memoryStorage.data[key] || null;
      console.log(
        "MemoryStorage: Data retrieved:",
        value ? "SUCCESS" : "MISSING",
      );
      return value;
    } catch (error) {
      console.error("MemoryStorage error:", error);
      return null;
    }
  },
  deleteItem: async (key) => {
    try {
      delete memoryStorage.data[key];
      console.log("MemoryStorage: Data deleted successfully for key:", key);
      return true;
    } catch (error) {
      console.error("MemoryStorage error:", error);
      return false;
    }
  },
  clearAll: async () => {
    try {
      memoryStorage.data = {};
      console.log("MemoryStorage: All data cleared");
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
        console.log("WebStorage: Data stored successfully");
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
        console.log("WebStorage: Data deleted successfully");
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
      console.log("Storing token:", token ? "TOKEN_EXISTS" : "TOKEN_NULL");

      // Try SecureStore first (if available on mobile)
      if (Platform.OS !== "web") {
        try {
          await SecureStore.setItem(STORAGE_KEYS.TOKEN, token);
          console.log("SecureStore token storage successful");

          // Verify immediately after SecureStore
          const verifySecure = await SecureStore.getItem(STORAGE_KEYS.TOKEN);
          console.log(
            "Immediate SecureStore token verification:",
            verifySecure ? "SUCCESS" : "FAILED",
          );

          if (!verifySecure) {
            console.warn(
              "SecureStore token verification failed, using memory storage fallback",
            );
            await memoryStorage.setItem(STORAGE_KEYS.TOKEN, token);
            console.log("MemoryStorage token fallback completed");
          }
        } catch (secureError) {
          console.warn(
            "SecureStore token failed, using memory storage fallback:",
            secureError,
          );
          await memoryStorage.setItem(STORAGE_KEYS.TOKEN, token);
          console.log("MemoryStorage token fallback completed");
        }
      } else {
        // Web platform - use localStorage or memory storage
        await webStorage.setItem(STORAGE_KEYS.TOKEN, token);
      }

      // Final verification
      const finalVerify = await memoryStorage.getItem(STORAGE_KEYS.TOKEN);
      console.log(
        "Final token verification result:",
        finalVerify ? "SUCCESS" : "FAILED",
      );

      return true;
    } catch (error) {
      console.error("Error storing token:", error);
      return false;
    }
  },

  // Get authentication token securely
  getToken: async () => {
    try {
      console.log("Retrieving token...");

      if (Platform.OS !== "web") {
        try {
          const token = await SecureStore.getItem(STORAGE_KEYS.TOKEN);
          if (token) {
            console.log("SecureStore token retrieval successful");
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
      console.log("Storing user data:", userData);
      const userDataString = JSON.stringify(userData);
      console.log("User data string length:", userDataString.length);

      // Try SecureStore first (if available on mobile)
      if (Platform.OS !== "web") {
        try {
          await SecureStore.setItem(STORAGE_KEYS.USER_DATA, userDataString);
          console.log("SecureStore setItem completed");

          // Verify immediately after SecureStore
          const verifySecure = await SecureStore.getItem(
            STORAGE_KEYS.USER_DATA,
          );
          console.log(
            "Immediate SecureStore verification:",
            verifySecure ? "SUCCESS" : "FAILED",
          );

          if (!verifySecure) {
            console.warn(
              "SecureStore verification failed, using memory storage fallback",
            );
            await memoryStorage.setItem(STORAGE_KEYS.USER_DATA, userDataString);
            console.log("MemoryStorage fallback completed");
          }
        } catch (secureError) {
          console.warn(
            "SecureStore failed, using memory storage fallback:",
            secureError,
          );
          await memoryStorage.setItem(STORAGE_KEYS.USER_DATA, userDataString);
          console.log("MemoryStorage fallback completed");
        }
      } else {
        // Web platform - use localStorage or memory storage
        await webStorage.setItem(STORAGE_KEYS.USER_DATA, userDataString);
      }

      // Final verification
      const finalVerify = await memoryStorage.getItem(STORAGE_KEYS.USER_DATA);
      console.log(
        "Final verification result:",
        finalVerify ? "SUCCESS" : "FAILED",
      );

      return true;
    } catch (error) {
      console.error("Error storing user data:", error);
      return false;
    }
  },

  // Get user data securely
  getUserData: async () => {
    try {
      console.log("Retrieving user data...");

      if (Platform.OS !== "web") {
        try {
          const userDataString = await SecureStore.getItem(
            STORAGE_KEYS.USER_DATA,
          );
          console.log("Retrieved user data string:", userDataString);

          if (!userDataString) {
            console.log("No user data found in storage");
            return null;
          }

          try {
            const userData = JSON.parse(userDataString);
            console.log("Successfully parsed user data:", userData);
            return userData;
          } catch (parseError) {
            console.error("Error parsing user data:", parseError);
            console.log("Invalid JSON string:", userDataString);
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
            console.log("No user data found in memory storage");
            return null;
          }

          try {
            const userData = JSON.parse(userDataString);
            console.log("Successfully parsed user data from memory:", userData);
            return userData;
          } catch (parseError) {
            console.error("Error parsing user data from memory:", parseError);
            console.log("Invalid JSON string:", userDataString);
            return null;
          }
        }
      } else {
        // Web platform - use localStorage or memory storage
        const userDataString = await webStorage.getItem(STORAGE_KEYS.USER_DATA);
        console.log("Retrieved user data string:", userDataString);

        if (!userDataString) {
          console.log("No user data found in storage");
          return null;
        }

        try {
          const userData = JSON.parse(userDataString);
          console.log("Successfully parsed user data:", userData);
          return userData;
        } catch (parseError) {
          console.error("Error parsing user data:", parseError);
          console.log("Invalid JSON string:", userDataString);
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
          console.log("SecureStore role storage successful");
        } catch (secureError) {
          console.warn(
            "SecureStore role failed, using memory storage fallback:",
            secureError,
          );
          await memoryStorage.setItem(STORAGE_KEYS.ROLE, role);
          console.log("MemoryStorage role fallback completed");
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
          console.log("SecureStore token deletion successful");
        } catch (secureError) {
          console.warn(
            "SecureStore failed, using memory storage fallback:",
            secureError,
          );
          await memoryStorage.deleteItem(STORAGE_KEYS.TOKEN);
          console.log("MemoryStorage token deletion successful");
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
          console.log("SecureStore user data deletion successful");
        } catch (secureError) {
          console.warn(
            "SecureStore failed, using memory storage fallback:",
            secureError,
          );
          await memoryStorage.deleteItem(STORAGE_KEYS.USER_DATA);
          console.log("MemoryStorage user data deletion successful");
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
          console.log("SecureStore role deletion successful");
        } catch (secureError) {
          console.warn(
            "SecureStore role failed, using memory storage fallback:",
            secureError,
          );
          await memoryStorage.deleteItem(STORAGE_KEYS.ROLE);
          console.log("MemoryStorage role deletion successful");
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
      console.log("Clearing all authentication data...");

      if (Platform.OS !== "web") {
        try {
          const SecureStore = require("expo-secure-store").default;
          await Promise.all([
            SecureStore.deleteItem(STORAGE_KEYS.TOKEN),
            SecureStore.deleteItem(STORAGE_KEYS.USER_DATA),
            SecureStore.deleteItem(STORAGE_KEYS.ROLE),
          ]);
          console.log("SecureStore: All data cleared successfully");
        } catch (secureError) {
          console.warn(
            "SecureStore clear failed, using memory storage fallback:",
            secureError,
          );
          await memoryStorage.deleteItem(STORAGE_KEYS.TOKEN);
          await memoryStorage.deleteItem(STORAGE_KEYS.USER_DATA);
          await memoryStorage.deleteItem(STORAGE_KEYS.ROLE);
          console.log("MemoryStorage: All data cleared");
        }
      } else {
        // Web platform - use localStorage or memory storage
        await webStorage.deleteItem(STORAGE_KEYS.TOKEN);
        await webStorage.deleteItem(STORAGE_KEYS.USER_DATA);
        await webStorage.deleteItem(STORAGE_KEYS.ROLE);
        console.log("WebStorage: All data cleared successfully");
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
