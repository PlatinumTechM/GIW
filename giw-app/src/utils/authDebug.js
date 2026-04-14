import { secureStorage } from './secureStorage';

// Authentication debugging utility
export const authDebug = {
  // Test secure storage functionality
  testSecureStorage: async () => {
    console.log("=== Testing Secure Storage ===");
    
    try {
      // Test storing token
      console.log("1. Testing token storage...");
      const testToken = "test-token-123";
      const tokenStored = await secureStorage.setToken(testToken);
      console.log("Token stored result:", tokenStored);
      
      // Test retrieving token
      console.log("2. Testing token retrieval...");
      const retrievedToken = await secureStorage.getToken();
      console.log("Retrieved token:", retrievedToken);
      console.log("Token matches:", retrievedToken === testToken ? "YES" : "NO");
      
      // Test storing user data
      console.log("3. Testing user data storage...");
      const testUserData = {
        name: "Test User",
        email: "test@example.com",
        company: "Test Company",
        phone: "1234567890",
        address: "123 Test St",
        gst: "TESTGST123"
      };
      const userDataStored = await secureStorage.setUserData(testUserData);
      console.log("User data stored result:", userDataStored);
      
      // Test retrieving user data
      console.log("4. Testing user data retrieval...");
      const retrievedUserData = await secureStorage.getUserData();
      console.log("Retrieved user data:", retrievedUserData);
      console.log("User data matches:", JSON.stringify(retrievedUserData) === JSON.stringify(testUserData) ? "YES" : "NO");
      
      // Test clearing data
      console.log("5. Testing data clearing...");
      const clearResult = await secureStorage.clearAll();
      console.log("Clear result:", clearResult);
      
      console.log("=== Secure Storage Test Complete ===");
      return {
        tokenTest: {
          stored: tokenStored,
          retrieved: retrievedToken,
          matches: retrievedToken === testToken
        },
        userDataTest: {
          stored: userDataStored,
          retrieved: retrievedUserData,
          matches: JSON.stringify(retrievedUserData) === JSON.stringify(testUserData)
        },
        clearTest: clearResult
      };
    } catch (error) {
      console.error("Secure storage test error:", error);
      return {
        error: error.message,
        tokenTest: { stored: false, retrieved: null, matches: false },
        userDataTest: { stored: false, retrieved: null, matches: false },
        clearTest: false
      };
    }
  },

  // Debug current authentication state
  debugAuthState: async () => {
    console.log("=== Debugging Authentication State ===");
    
    try {
      const token = await secureStorage.getToken();
      console.log("Token exists:", !!token);
      
      const userData = await secureStorage.getUserData();
      console.log("User data exists:", !!userData);
      
      const role = await secureStorage.getRole();
      console.log("Role exists:", !!role);
      
      const isAuthenticated = await secureStorage.isAuthenticated();
      console.log("Is authenticated:", isAuthenticated);
      
      return {
        token,
        userData,
        role,
        isAuthenticated
      };
    } catch (error) {
      console.error("Auth state debug error:", error);
      return {
        token: null,
        userData: null,
        role: null,
        isAuthenticated: false,
        error: error.message
      };
    }
  },

  // Fix authentication by clearing corrupted data
  fixAuthData: async () => {
    console.log("=== Fixing Authentication Data ===");
    
    try {
      // Clear all existing data
      await secureStorage.clearAll();
      console.log("Cleared all existing data");
      
      // Set fresh test data
      const testToken = "fixed-test-token-" + Date.now();
      const testUserData = {
        name: "Fixed Test User",
        email: "fixed@example.com",
        company: "Fixed Company",
        phone: "9876543210",
        address: "Fixed Address",
        gst: "FIXEDGST123"
      };
      
      await secureStorage.setToken(testToken);
      await secureStorage.setUserData(testUserData);
      await secureStorage.setRole("user");
      
      console.log("Set fresh test data");
      return true;
    } catch (error) {
      console.error("Fix auth data error:", error);
      return false;
    }
  }
};

export default authDebug;
