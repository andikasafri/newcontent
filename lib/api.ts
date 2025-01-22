const API_URL = 'https://api.escuelajs.co/api/v1';

// Server-side fetching with caching
export async function getProducts(offset = 0, limit = 10) {
  const res = await fetch(`${API_URL}/products?offset=${offset}&limit=${limit}`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProduct(id: number) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    next: { revalidate: 3600 }
  });
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`, {
    next: { revalidate: 86400 } // Cache for 24 hours
  });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

// Admin API endpoints
export async function getStats() {
  const res = await fetch(`${API_URL}/stats`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    next: { revalidate: 300 } // Cache for 5 minutes
  });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function getOrders() {
  const res = await fetch(`${API_URL}/orders`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    next: { revalidate: 60 } // Cache for 1 minute
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function updateOrderStatus(orderId: number, status: string) {
  const res = await fetch(`${API_URL}/orders/${orderId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update order status');
  return res.json();
}

// Authentication endpoints
export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Failed to login');
  return res.json();
}

export async function register(email: string, password: string, name: string) {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, avatar: 'https://api.dicebear.com/7.x/avataaars/svg' }),
  });
  if (!res.ok) throw new Error('Failed to register');
  return res.json();
}

export async function getProfile(token: string) {
  const res = await fetch(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 }
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}