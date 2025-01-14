import axios from "axios";

// Define the base URL for our API requests
const BASE_URL = "https://api.escuelajs.co/api/v1";

// Create an instance of Axios with the base URL
const api = axios.create({
  baseURL: BASE_URL,
});

// Add an interceptor to include the auth token in requests
api.interceptors.request.use((config) => {
  // Check if a token is available in local storage
  const token = localStorage.getItem("token");
  if (token) {
    // Add the token to the Authorization header
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fetch products from the API
 * @param {number} offset - The offset for pagination
 * @param {number} limit - The limit for pagination
 * @returns {Promise} A promise resolving to the product data
 */
export const getProducts = async (offset = 0, limit = 12) => {
  try {
    const response = await api.get(`/products?offset=${offset}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

/**
 * Fetch a single product from the API
 * @param {number} id - The ID of the product to fetch
 * @returns {Promise} A promise resolving to the product data
 */
export const getProduct = async (id: number) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

/**
 * Fetch categories from the API
 * @returns {Promise} A promise resolving to the category data
 */
export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Login to the API
 * @param {string} email - The email address to login with
 * @param {string} password - The password to login with
 * @returns {Promise} A promise resolving to the login response
 */
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

/**
 * Register a new user with the API
 * @param {object} userData - The user data to register with
 * @returns {Promise} A promise resolving to the registration response
 */
export const register = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const data = {
      ...userData,
      avatar: "https://api.lorem.space/image/face?w=640&h=480",
    };
    const response = await api.post("/users", data);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

/**
 * Fetch the current user's profile from the API
 * @returns {Promise} A promise resolving to the profile data
 */
export const getProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export default api;
