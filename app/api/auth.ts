import { createClientApi } from "./config";
import type { User } from "../../types";

const api = createClientApi();

interface LoginResponse {
  access_token: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

/**
 * Authenticate user with email and password
 * @param email - User's email
 * @param password - User's password
 * @returns Promise containing authentication token
 */
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

/**
 * Register a new user
 * @param userData - User registration data
 * @returns Promise containing user data
 */
export const register = async (userData: RegisterData): Promise<User> => {
  const data = {
    ...userData,
    avatar: Array.isArray(userData.avatar)
      ? userData.avatar[0]
      : userData.avatar || "https://api.lorem.space/image/face?w=640&h=480",
  };
  const response = await api.post("/users", data);
  return response.data;
};

/**
 * Get authenticated user's profile
 * @returns Promise containing user profile data
 */
export const getProfile = async (): Promise<User> => {
  const response = await api.get("/auth/profile");
  return response.data;
};
