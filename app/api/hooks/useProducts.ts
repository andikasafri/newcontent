"use client";

import { useQuery } from "@tanstack/react-query";
import api from "../api/config";
import type { Product } from "@/app/types";

interface UseProductsOptions {
  offset?: number;
  limit?: number;
  categoryId?: number;
}

export function useProducts({ offset = 0, limit = 12, categoryId }: UseProductsOptions = {}) {
  return useQuery({
    queryKey: ["products", { offset, limit, categoryId }],
    queryFn: async () => {
      const params = new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString(),
        ...(categoryId && { categoryId: categoryId.toString() }),
      });

      const { data } = await api.get<Product[]>(`/products?${params}`);
      return data;
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await api.get<Product>(`/products/${id}`);
      return data;
    },
    enabled: !!id,
  });
}