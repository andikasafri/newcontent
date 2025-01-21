import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse } from './types';
import * as api from './api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

// Admin credentials
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin1234';

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAdmin: false,
      login: async (email: string, password: string) => {
        // Check for admin login
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          set({
            user: {
              id: 0,
              email: ADMIN_EMAIL,
              name: 'Admin',
              role: 'admin',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
            },
            token: 'admin-token',
            isAdmin: true
          });
          return;
        }

        const auth: AuthResponse = await api.login(email, password);
        const user = await api.getProfile(auth.access_token);
        set({ user, token: auth.access_token, isAdmin: false });
      },
      register: async (email: string, password: string, name: string) => {
        await api.register(email, password, name);
        const auth: AuthResponse = await api.login(email, password);
        const user = await api.getProfile(auth.access_token);
        set({ user, token: auth.access_token, isAdmin: false });
      },
      logout: () => set({ user: null, token: null, isAdmin: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);