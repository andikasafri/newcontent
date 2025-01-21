import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse } from './types';
import * as api from './api';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (email: string, password: string) => {
        const auth: AuthResponse = await api.login(email, password);
        const user = await api.getProfile(auth.access_token);
        set({ user, token: auth.access_token });
      },
      register: async (email: string, password: string, name: string) => {
        await api.register(email, password, name);
        const auth: AuthResponse = await api.login(email, password);
        const user = await api.getProfile(auth.access_token);
        set({ user, token: auth.access_token });
      },
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);