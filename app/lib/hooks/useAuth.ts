'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/useAuthStore';
import apiClient from '../utils/api-client';
import toast from 'react-hot-toast';
import { ApiResponse } from '@/app/types/api';
import { User } from '@/app/types';

interface LoginResponse {
  access_token: string;
}

interface AuthError {
  message: string;
}

export function useAuth() {
  const router = useRouter();
  const { setUser, clearUser } = useAuthStore();

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', {
        email,
        password,
      });
      
      localStorage.setItem('token', data.data.access_token);
      
      const { data: profileData } = await apiClient.get<ApiResponse<User>>('/auth/profile');
      setUser(profileData.data);
      
      toast.success('Successfully logged in!');
      router.push('/');
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message || 'Invalid credentials');
      throw error;
    }
  }, [router, setUser]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      await apiClient.post<ApiResponse<User>>('/users', {
        name,
        email,
        password,
        avatar: 'https://api.lorem.space/image/face?w=640&h=480',
      });
      
      await login(email, password);
      toast.success('Successfully registered!');
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message || 'Registration failed');
      throw error;
    }
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    clearUser();
    toast.success('Successfully logged out');
    router.push('/');
  }, [router, clearUser]);

  return {
    login,
    register,
    logout,
  };
}