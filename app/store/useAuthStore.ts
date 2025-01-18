"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";
import { login as apiLogin, register as apiRegister } from "../lib/api/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        const response = await apiLogin(email, password);
        if (typeof window !== "undefined") {
          localStorage.setItem("token", response.access_token);
        }
        set({ isAuthenticated: true });
      },
      register: async (name, email, password) => {
        await apiRegister({ name, email, password });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        set({ user: null, isAuthenticated: false });
      },
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      skipHydration: true,
    }
  )
);
