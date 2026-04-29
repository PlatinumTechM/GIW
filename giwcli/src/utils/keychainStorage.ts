import * as Keychain from 'react-native-keychain';

// Keychain service names
const KEYCHAIN_SERVICES = {
  TOKEN: 'com.giw.auth.token',
  USER_DATA: 'com.giw.auth.userData',
  CREDENTIALS: 'com.giw.auth.credentials',
};

interface UserData {
  id: string;
  email: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

interface Credentials {
  username: string;
  password: string;
}

class KeychainStorage {
  /**
   * Check if keychain is available and accessible
   */
  async isKeychainAccessible(): Promise<boolean> {
    try {
      await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICES.TOKEN,
      });
      return true;
    } catch (error) {
      console.warn('Keychain not accessible:', error);
      return false;
    }
  }

  /**
   * Store authentication token securely using keychain
   */
  async setToken(token: string): Promise<boolean> {
    try {
      await Keychain.setGenericPassword('token', token, {
        service: KEYCHAIN_SERVICES.TOKEN,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      });
      return true;
    } catch (error) {
      console.error('Error storing token:', error);
      return false;
    }
  }

  /**
   * Retrieve authentication token from keychain
   */
  async getToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICES.TOKEN,
      });
      if (credentials && credentials.password) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  }

  /**
   * Store user credentials (username/password) for auto-login
   */
  async setCredentials(username: string, password: string): Promise<boolean> {
    try {
      const credentials = JSON.stringify({ username, password });
      await Keychain.setGenericPassword('credentials', credentials, {
        service: KEYCHAIN_SERVICES.CREDENTIALS,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      return true;
    } catch (error) {
      console.error('Error storing credentials:', error);
      return false;
    }
  }

  /**
   * Retrieve stored credentials for auto-login
   */
  async getCredentials(): Promise<Credentials | null> {
    try {
      const result: Keychain.UserCredentials | false =
        await Keychain.getGenericPassword({
          service: KEYCHAIN_SERVICES.CREDENTIALS,
        });

      if (result && result.password) {
        return JSON.parse(result.password);
      }
      return null;
    } catch (error) {
      console.error('Error retrieving credentials:', error);
      return null;
    }
  }

  /**
   * Store user data securely
   */
  async setUserData(userData: UserData | null): Promise<boolean> {
    try {
      if (!userData) {
        return this.removeUserData();
      }
      const userDataString = JSON.stringify(userData);
      await Keychain.setGenericPassword('userData', userDataString, {
        service: KEYCHAIN_SERVICES.USER_DATA,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      });
      return true;
    } catch (error) {
      console.error('Error storing user data:', error);
      return false;
    }
  }

  /**
   * Retrieve user data from secure storage
   */
  async getUserData(): Promise<UserData | null> {
    try {
      const result: Keychain.UserCredentials | false =
        await Keychain.getGenericPassword({
          service: KEYCHAIN_SERVICES.USER_DATA,
        });

      if (result && result.password) {
        return JSON.parse(result.password);
      }
      return null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  /**
   * Remove authentication token
   */
  async removeToken(): Promise<boolean> {
    try {
      await Keychain.resetGenericPassword({
        service: KEYCHAIN_SERVICES.TOKEN,
      });
      return true;
    } catch (error) {
      console.error('Error removing token:', error);
      return false;
    }
  }

  /**
   * Remove stored credentials
   */
  async removeCredentials(): Promise<boolean> {
    try {
      await Keychain.resetGenericPassword({
        service: KEYCHAIN_SERVICES.CREDENTIALS,
      });
      return true;
    } catch (error) {
      console.error('Error removing credentials:', error);
      return false;
    }
  }

  /**
   * Remove user data
   */
  async removeUserData(): Promise<boolean> {
    try {
      await Keychain.resetGenericPassword({
        service: KEYCHAIN_SERVICES.USER_DATA,
      });
      return true;
    } catch (error) {
      console.error('Error removing user data:', error);
      return false;
    }
  }

  /**
   * Clear all authentication data
   */
  async clearAll(): Promise<boolean> {
    try {
      await Promise.all([
        Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICES.TOKEN }),
        Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICES.USER_DATA }),
        Keychain.resetGenericPassword({
          service: KEYCHAIN_SERVICES.CREDENTIALS,
        }),
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  }

  /**
   * Check if user is authenticated (has token)
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null && token !== '';
  }
}

export const keychainStorage = new KeychainStorage();
export default keychainStorage;
