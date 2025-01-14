/**
 * Category-related API endpoints
 */

import api from "./config";
import type { Category } from "../../types";

/**
 * Fetch all categories
 * @returns Promise containing category data
 */
export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");
  return response.data;
};
