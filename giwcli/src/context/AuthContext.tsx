import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { keychainStorage } from '../utils/keychainStorage';
import api from '../utils/api';

// Types
interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    identifier: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  register: (
    userData: any,
  ) => Promise<{ success: boolean; error?: string; user?: User }>;
  updateUser: (
    userData: Partial<User>,
  ) => Promise<{ success: boolean; error?: string }>;
  refreshToken: () => Promise<{
    success: boolean;
    error?: string;
    token?: string;
  }>;
  hasRole: (requiredRole: string) => boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

// API response types
interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

interface RegisterResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);

        // Check for existing token
        const storedToken = await keychainStorage.getToken();
        const storedUser = await keychainStorage.getUserData();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
          setRole(storedUser.role?.toLowerCase() || 'user');
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login with credentials
   */
  const login = useCallback(
    async (identifier: string, password: string, rememberMe = false) => {
      try {
        setIsLoading(true);

        const response = await api.post('/auth/login', {
          email: identifier,
          password: password,
        });

        const result: LoginResponse = response.data;

        // Backend returns token and user directly without success field
        if (result.token && result.user) {
          // Store token and user data
          await keychainStorage.setToken(result.token);
          await keychainStorage.setUserData(result.user);

          // Store credentials for auto-login if remember me is enabled
          if (rememberMe) {
            await keychainStorage.setCredentials(identifier, password);
          }

          setToken(result.token);
          setUser(result.user);
          setRole(result.user.role?.toLowerCase() || 'user');
          setIsAuthenticated(true);

          return { success: true, user: result.user };
        } else {
          return { success: false, error: result.message || 'Login failed' };
        }
      } catch (error: any) {
        console.error('Login error:', error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'An error occurred during login';
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);

      // Clear token and user data
      await keychainStorage.removeToken();
      await keychainStorage.removeUserData();

      setToken(null);
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);

      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(async (userData: any) => {
    try {
      setIsLoading(true);

      const response = await api.post('/auth/register', userData);
      const result: RegisterResponse = response.data;

      // Backend returns token and user directly without success field
      if (result.token && result.user) {
        // Store token and user data
        await keychainStorage.setToken(result.token);
        await keychainStorage.setUserData(result.user);

        setToken(result.token);
        setUser(result.user);
        setRole(result.user.role?.toLowerCase() || 'user');
        setIsAuthenticated(true);

        return { success: true, user: result.user };
      } else {
        return {
          success: false,
          error: result.message || 'Registration failed',
        };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'An error occurred during registration';
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update user data
   */
  const updateUser = useCallback(
    async (userData: Partial<User>) => {
      try {
        const updatedUser = { ...user, ...userData } as User;
        await keychainStorage.setUserData(updatedUser);
        setUser(updatedUser);
        return { success: true };
      } catch (error: any) {
        console.error('Update user error:', error);
        return { success: false, error: error.message };
      }
    },
    [user],
  );

  /**
   * Refresh token
   */
  const refreshToken = useCallback(async () => {
    try {
      const response = await api.post('/auth/refresh-token');
      const result = response.data;

      if (result.success && result.token) {
        await keychainStorage.setToken(result.token);
        setToken(result.token);
        return { success: true, token: result.token };
      } else {
        return {
          success: false,
          error: result.message || 'Token refresh failed',
        };
      }
    } catch (error: any) {
      console.error('Token refresh error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Token refresh failed';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Check if user has specific role
   * Roles: admin, buyer, seller
   * - admin: full access
   * - buyer: can browse and buy
   * - seller: can manage stock
   */
  const hasRole = useCallback(
    (requiredRole: string): boolean => {
      if (!role) return false;

      // Exact role match
      if (requiredRole === role) return true;

      // Admin has access to everything
      if (role === 'admin') return true;

      // Role hierarchy checks
      if (requiredRole === 'user') {
        // buyer, seller, admin are all considered users
        return ['buyer', 'seller', 'admin'].includes(role);
      }

      return false;
    },
    [role],
  );

  const value: AuthContextType = {
    user,
    token,
    role,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    updateUser,
    refreshToken,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
