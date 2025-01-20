"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";
import api from "../api/config";
import toast from "react-hot-toast";
import type { User } from "@/app/types";

interface LoginResponse {
  access_token: string;
}

export function useAuth() {
  const router = useRouter();
  const { setUser, clearUser } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { data } = await api.post<LoginResponse>("/auth/login", {
          email,
          password,
        });

        localStorage.setItem("token", data.access_token);

        const profileResponse = await api.get<User>("/auth/profile");
        setUser(profileResponse.data);

        toast.success("Successfully logged in!");
        router.push("/");
      } catch (error) {
        toast.error("Invalid credentials");
        throw error;
      }
    },
    [router, setUser]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        await api.post("/users", {
          name,
          email,
          password,
          avatar: "https://api.lorem.space/image/face?w=640&h=480",
        });

        await login(email, password);
        toast.success("Successfully registered!");
      } catch (error) {
        toast.error("Registration failed");
        throw error;
      }
    },
    [login]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    clearUser();
    toast.success("Successfully logged out");
    router.push("/");
  }, [router, clearUser]);

  return {
    login,
    register,
    logout,
  };
}