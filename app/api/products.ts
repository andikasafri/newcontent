import { baseApi } from "./config";
import type { Product } from "../../types";

/**
 * Fetch products with pagination
 * @param offset - Number of items to skip
 * @param limit - Number of items to fetch
 * @returns Promise containing product data
 */
export const getProducts = async (
  offset = 0,
  limit = 12
): Promise<Product[]> => {
  const response = await baseApi.get(`/products?offset=${offset}&limit=${limit}`);
  return response.data;
};

/**
 * Fetch a single product by ID
 * @param id - Product ID
 * @returns Promise containing product data
 */
export const getProduct = async (id: number): Promise<Product> => {
  const response = await baseApi.get(`/products/${id}`);
  return response.data;
};