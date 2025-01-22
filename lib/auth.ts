import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse } from './types';
import * as api from './api';

interface AuthState {
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

// Admin credentials
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin1234';

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAdmin: false,
      isLoading: true,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
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
            
            set({ 
              user: adminUser,
              token: 'admin-token',
              isAdmin: true,
              isLoading: false 
            });
            
            return;
          }

          const auth: AuthResponse = await api.login(email, password);
          const user = await api.getProfile(auth.access_token);
          
          // Set cookies for middleware authentication
          document.cookie = `access-token=${auth.access_token}; path=/; max-age=900`; // 15 minutes
          document.cookie = `refresh-token=${auth.refresh_token}; path=/; max-age=604800`; // 7 days
          
          set({ 
            user,
            token: auth.access_token,
            isAdmin: user.role === 'admin',
            isLoading: false 
          });
        } catch (error) {
          set({ error: 'Invalid credentials', isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          await api.register(email, password, name);
          const auth: AuthResponse = await api.login(email, password);
          const user = await api.getProfile(auth.access_token);
          
          // Set cookies for middleware authentication
          document.cookie = `access-token=${auth.access_token}; path=/; max-age=900`;
          document.cookie = `refresh-token=${auth.refresh_token}; path=/; max-age=604800`;
          
          set({ 
            user,
            token: auth.access_token,
            isAdmin: user.role === 'admin',
            isLoading: false 
          });
        } catch (error) {
          set({ error: 'Registration failed', isLoading: false });
          throw error;
        }
      },

      logout: () => {
        // Clear cookies
        document.cookie = 'access-token=; path=/; max-age=0';
        document.cookie = 'refresh-token=; path=/; max-age=0';
        
        set({ 
          user: null,
          token: null,
          isAdmin: false,
          isLoading: false,
          error: null 
        });
      },

      updateProfile: async (data: Partial<User>) => {
        const { user, token } = get();
        if (!user || !token) return;

        set({ isLoading: true, error: null });
        try {
          // Make API call to update profile
          const updatedUser = { ...user, ...data };
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to update profile', isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAdmin: state.isAdmin,
      }),
    }
  )
);