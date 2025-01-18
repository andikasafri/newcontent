import { useQuery, UseQueryResult } from '@tanstack/react-query';
import apiClient from '../utils/api-client';
import { Product } from '@/app/types';
import { ApiResponse, PaginatedResponse } from '@/app/types/api';

interface UseProductsOptions {
  offset?: number;
  limit?: number;
  categoryId?: number;
}

export function useProducts(
  { offset = 0, limit = 12, categoryId }: UseProductsOptions = {}
): UseQueryResult<Product[]> {
  return useQuery({
    queryKey: ['products', { offset, limit, categoryId }],
    queryFn: async () => {
      const params = new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString(),
        ...(categoryId && { categoryId: categoryId.toString() }),
      });

      const { data } = await apiClient.get<ApiResponse<Product[]>>(`/products?${params}`);
      return data.data;
    },
  });
}

export function useProduct(id: number): UseQueryResult<Product> {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}