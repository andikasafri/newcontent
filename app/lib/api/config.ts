import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.escuelajs.co/api/v1";

// Create a base API client without auth interceptors for server-side requests
export const baseApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create a client-side API instance with auth interceptors
export function createClientApi() {
  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Only add auth interceptors on the client side
  if (typeof window !== "undefined") {
    api.interceptors.request.use(
      async (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  return api;
}