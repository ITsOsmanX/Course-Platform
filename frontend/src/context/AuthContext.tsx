'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import api, { setInMemoryToken } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  isBlocked?: boolean;
  purchaseHistory?: { _id: string }[];
}


interface AuthContextType {
  user: User | null;
  token: string | null;
  role: 'student' | 'admin' | null;
  isLoading: boolean;
  login: (credentials: Record<string, any>) => Promise<void>;
  register: (data: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<'student' | 'admin' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  /**
   * Save authenticated user state
   */
  const handleAuthSuccess = (accessToken: string, userData: User) => {
    setInMemoryToken(accessToken);
    setToken(accessToken);
    setUser(userData);
    setRole(userData.role);
  };

  /**
   * Clear authentication state
   */
  const clearAuthState = () => {
    setInMemoryToken(null);
    setToken(null);
    setUser(null);
    setRole(null);
  };

  /**
   * Attempt silent login using refresh token cookie
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const refreshResponse = await api.post('/auth/refresh');
        const { accessToken } = refreshResponse.data;

        setInMemoryToken(accessToken);

        const profileResponse = await api.get('/users/profile');

        handleAuthSuccess(accessToken, profileResponse.data);
      } catch (error) {
        clearAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Listen for session expiration from Axios interceptor
   */
  useEffect(() => {
    const handleExpiry = () => {
      clearAuthState();
      router.push('/login?expired=true');
    };

    window.addEventListener('auth-session-expired', handleExpiry);

    return () => {
      window.removeEventListener('auth-session-expired', handleExpiry);
    };
  }, [router]);

  /**
   * Login
   */
  const login = async (credentials: Record<string, any>) => {
    setIsLoading(true);

    try {
      // ✅ Correct endpoint
      const response = await api.post('/auth/login', credentials);

      const {
        accessToken,
        user: userData,
      } = response.data;

      handleAuthSuccess(accessToken, userData);

      if (userData.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register
   */
  const register = async (data: Record<string, any>) => {
    setIsLoading(true);

    try {
      await api.post('/auth/register', data);

      // (auth) is a route group, so login page is /login
      router.push('/login?registered=true');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout
   */
  const logout = async () => {
    setIsLoading(true);

    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      clearAuthState();
      router.push('/');
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};