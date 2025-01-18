import { baseApi } from "./api/config";
import type { Product } from "../types";

/**
 * Fetch products from the API
 * @param {number} offset - The offset for pagination
 * @param {number} limit - The limit for pagination
 * @returns {Promise} A promise resolving to the product data
 */
export const getProducts = async (offset = 0, limit = 12) => {
  try {
    const response = await baseApi.get(`/products?offset=${offset}&limit=${limit}`);
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
    const response = await baseApi.get(`/products/${id}`);
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
    const response = await baseApi.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};