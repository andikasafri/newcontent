/**
 * API configuration and axios instance setup
 */

import axios from "axios";

/** Base URL for the API */
export const BASE_URL = "https://api.escuelajs.co/api/v1";

/** Create axios instance with default configuration */
export const api = axios.create({
  baseURL: BASE_URL,
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
