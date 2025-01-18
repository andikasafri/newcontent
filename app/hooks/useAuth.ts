"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

/**
 * Custom hook for handling authentication operations
 * Provides login, register, and logout functionality with error handling and navigation
 */
export function useAuth() {
  const router = useRouter();
  const { login: authLogin, register: authRegister, logout: authLogout, isAuthenticated, user } = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    try {
      await authLogin(email, password);
      toast.success("Successfully logged in!");
      router.push("/");
    } catch (error) {
      toast.error("Invalid credentials");
      throw error;
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      await authRegister(name, email, password);
      toast.success("Successfully registered!");
      router.push("/");
    } catch (error) {
      toast.error("Registration failed");
      throw error;
    }
  };

  const handleLogout = () => {
    authLogout();
    toast.success("Successfully logged out");
    router.push("/");
  };

  return {
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAuthenticated,
    user,
  };
}