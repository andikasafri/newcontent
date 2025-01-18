import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.escuelajs.co/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  async (config) => {
    // Only run on client side
    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      try {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;