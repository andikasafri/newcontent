import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

/**
 * Custom hook for handling authentication operations
 * Provides login, register, and logout functionality with error handling and navigation
 */
export function useAuth() {
  const navigate = useNavigate();
  const { login, register, logout, isAuthenticated, user } = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      toast.success("Successfully logged in!");
      navigate("/");
    } catch (error) {
      toast.error("Invalid credentials");
      throw error;
    }
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      await register(name, email, password);
      toast.success("Successfully registered!");
      navigate("/");
    } catch (error) {
      toast.error("Registration failed");
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out");
    navigate("/");
  };

  return {
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAuthenticated,
    user,
  };
}
