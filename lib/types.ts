import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
  stock?: number;
  ratings?: number;
  reviews?: number;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  description?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar: string;
  address?: Address;
  preferences?: UserPreferences;
  wishlist?: number[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  orderUpdates: boolean;
  promotionalEmails: boolean;
  newsletter: boolean;
  currency: string;
  language: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderStatus {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  timestamp: Date;
  location?: string;
  description?: string;
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  status: OrderStatus['status'];
  trackingHistory: OrderStatus[];
  createdAt: string;
  shippingAddress: Address;
  paymentMethod: string;
  trackingNumber?: string;
}

export interface CheckoutFormData {
  email: string;
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}