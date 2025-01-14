import { create } from "zustand";
import { User } from "../types";
import {
  login as apiLogin,
  register as apiRegister,
  getProfile,
} from "../lib/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email, password) => {
    try {
      const { access_token } = await apiLogin(email, password);
      localStorage.setItem("token", access_token);
      const user = await getProfile();
      set({ user, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem("token");
      throw error;
    }
  },
  register: async (name, email, password) => {
    await apiRegister({ name, email, password });
    const { access_token } = await apiLogin(email, password);
    localStorage.setItem("token", access_token);
    const user = await getProfile();
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false });
  },
  loadUser: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      const user = await getProfile();
      set({ user, isAuthenticated: true });
    } catch {
      localStorage.removeItem("token");
      set({ user: null, isAuthenticated: false });
    }
  },
}));
