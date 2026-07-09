'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api, { setInMemoryToken } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  isBlocked?: boolean;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Helper to establish state locally
  const handleAuthSuccess = (accessToken: string, userData: User) => {
    setInMemoryToken(accessToken);
    setToken(accessToken);
    setUser(userData);
    setRole(userData.role);
  };

  // Clear global auth state cleanly
  const clearAuthState = () => {
    setInMemoryToken(null);
    setToken(null);
    setUser(null);
    setRole(null);
  };

  // 1. Silent Refresh on App Mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await api.post('/auth/refresh');
        const { accessToken } = response.data;
        
        // Fetch full profile info now that memory has the token
        setInMemoryToken(accessToken);
        const profileResponse = await api.get('/users/profile');
        
        handleAuthSuccess(accessToken, profileResponse.data);
      } catch (err) {
        // Silent catch: means cookie is missing/expired, keep user logged out gracefully
        clearAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 2. Listen for interceptor broadcasted session expiries
  useEffect(() => {
    const handleExpiry = () => {
      clearAuthState();
      router.push('/auth/login?expired=true');
    };

    window.addEventListener('auth-session-expired', handleExpiry);
    return () => window.removeEventListener('auth-session-expired', handleExpiry);
  }, [router]);

  const login = async (credentials: Record<string, any>) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', credentials);
      const { accessToken, user: userData } = response.data;
      handleAuthSuccess(accessToken, userData);
      
      // Dynamic Role Routing
      if (userData.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: Record<string, any>) => {
    setIsLoading(true);
    try {
      await api.post('/auth/register', data);
      
      // Note: If backend does NOT auto-login upon registration, forward to login.
      // If it does auto-login, update context state here instead. Assuming explicit login required:
      router.push('/auth/login?registered=true');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error on server clearing:', err);
    } finally {
      clearAuthState();
      router.push('/');
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, role, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};