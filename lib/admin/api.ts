import { ApiError } from '../api';

const ADMIN_API_URL = 'https://api.escuelajs.co/api/v1/admin';

// Admin-specific API functions
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      error.message || 'Admin API Error',
      error
    );
  }
  return response.json();
}

export async function getAdminStats(period: string = 'week') {
  try {
    const res = await fetch(`${ADMIN_API_URL}/stats?period=${period}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      next: { revalidate: 300 }
    });
    return handleResponse<AdminStats>(res);
  } catch (error) {
    throw new ApiError(500, 'Failed to fetch admin stats');
  }
}

export async function getInventoryStats() {
  try {
    const res = await fetch(`${ADMIN_API_URL}/inventory`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      next: { revalidate: 300 }
    });
    return handleResponse<InventoryStats>(res);
  } catch (error) {
    throw new ApiError(500, 'Failed to fetch inventory stats');
  }
}

export async function getSalesForecasts() {
  try {
    const res = await fetch(`${ADMIN_API_URL}/forecasts`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      next: { revalidate: 3600 }
    });
    return handleResponse<SalesForecast[]>(res);
  } catch (error) {
    throw new ApiError(500, 'Failed to fetch sales forecasts');
  }
}

export async function getCustomerSegments() {
  try {
    const res = await fetch(`${ADMIN_API_URL}/customer-segments`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      next: { revalidate: 3600 }
    });
    return handleResponse<CustomerSegment[]>(res);
  } catch (error) {
    throw new ApiError(500, 'Failed to fetch customer segments');
  }
}

export async function batchUpdateProducts(updates: ProductBatchUpdate[]) {
  try {
    const res = await fetch(`${ADMIN_API_URL}/products/batch`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ updates }),
    });
    return handleResponse<Product[]>(res);
  } catch (error) {
    throw new ApiError(500, 'Failed to batch update products');
  }
}

export async function batchUpdateOrders(updates: OrderBatchUpdate[]) {
  try {
    const res = await fetch(`${ADMIN_API_URL}/orders/batch`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ updates }),
    });
    return handleResponse<Order[]>(res);
  } catch (error) {
    throw new ApiError(500, 'Failed to batch update orders');
  }
}

export async function importProducts(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch(`${ADMIN_API_URL}/products/import`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    return handleResponse<ImportResult>(res);
  } catch (error) {
    throw new ApiError(500, 'Failed to import products');
  }
}

export async function exportProducts(filters?: ProductExportFilters) {
  try {
    const queryString = filters ? `?${new URLSearchParams(filters as any)}` : '';
    const res = await fetch(`${ADMIN_API_URL}/products/export${queryString}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return res.blob();
  } catch (error) {
    throw new ApiError(500, 'Failed to export products');
  }
}