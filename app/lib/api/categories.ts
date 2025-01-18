import { baseApi } from "./config";
import type { Category } from "../../types";

/**
 * Fetch all categories
 * @returns Promise containing category data
 */
export const getCategories = async (): Promise<Category[]> => {
  const response = await baseApi.get("/categories");
  return response.data;
};