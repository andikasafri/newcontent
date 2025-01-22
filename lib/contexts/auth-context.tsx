'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthResponse } from '@/lib/types';
import * as api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Admin credentials
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin1234';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedToken = localStorage.getItem('auth-token');
    if (storedToken) {
      loadUserProfile(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUserProfile = async (authToken: string) => {
    try {
      const userData = await api.getProfile(authToken);
      setUser(userData);
      setToken(authToken);
      setIsAdmin(userData.role === 'admin');
    } catch (error) {
      localStorage.removeItem('auth-token');
      setError('Session expired. Please login again.');
      toast({
        variant: 'destructive',
        description: 'Session expired. Please login again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Check for admin login
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser = {
          id: 0,
          email: ADMIN_EMAIL,
          name: 'Admin',
          role: 'admin',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        } as User;
        setUser(adminUser);
        setToken('admin-token');
        setIsAdmin(true);
        localStorage.setItem('auth-token', 'admin-token');
        return;
      }

      const auth: AuthResponse = await api.login(email, password);
      const userData = await api.getProfile(auth.access_token);
      
      setUser(userData);
      setToken(auth.access_token);
      setIsAdmin(userData.role === 'admin');
      localStorage.setItem('auth-token', auth.access_token);
    } catch (err) {
      setError('Invalid credentials');
      toast({
        variant: 'destructive',
        description: 'Invalid credentials',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.register(email, password, name);
      const auth: AuthResponse = await api.login(email, password);
      const userData = await api.getProfile(auth.access_token);
      
      setUser(userData);
      setToken(auth.access_token);
      setIsAdmin(userData.role === 'admin');
      localStorage.setItem('auth-token', auth.access_token);
    } catch (err) {
      setError('Registration failed');
      toast({
        variant: 'destructive',
        description: 'Registration failed',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('auth-token');
    toast({
      description: 'Logged out successfully',
    });
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user || !token) return;
    
    setIsLoading(true);
    try {
      // API call to update profile
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      toast({
        description: 'Profile updated successfully',
      });
    } catch (err) {
      setError('Failed to update profile');
      toast({
        variant: 'destructive',
        description: 'Failed to update profile',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}