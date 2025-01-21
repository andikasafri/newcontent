"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/types";

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  savedItems: CartItem[];
  discountCode: string | null;
  discountAmount: number;
  shipping: number;
  subtotal: number;
  total: number;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  saveForLater: (productId: number) => void;
  moveToCart: (productId: number) => void;
  applyDiscount: (code: string) => void;
  removeDiscount: () => void;
  clearCart: () => void;
}

const DISCOUNT_CODES = {
  SAVE10: 0.1,
  SAVE20: 0.2,
  FREESHIP: 0,
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],
      discountCode: null,
      discountAmount: 0,
      shipping: 0,
      subtotal: 0,
      total: 0,

      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id
          );
          const newItems = existingItem
            ? state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            : [...state.items, { ...product, quantity: 1 }];

          const subtotal = newItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          const shipping = subtotal > 100 ? 0 : 10;
          const total = subtotal + shipping - subtotal * state.discountAmount;

          return {
            items: newItems,
            subtotal,
            shipping,
            total,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== productId);
          const subtotal = newItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          const shipping = subtotal > 100 ? 0 : 10;
          const total = subtotal + shipping - subtotal * state.discountAmount;

          return {
            items: newItems,
            subtotal,
            shipping,
            total,
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          );
          const subtotal = newItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          const shipping = subtotal > 100 ? 0 : 10;
          const total = subtotal + shipping - subtotal * state.discountAmount;

          return {
            items: newItems,
            subtotal,
            shipping,
            total,
          };
        });
      },

      saveForLater: (productId) => {
        set((state) => {
          const item = state.items.find((item) => item.id === productId);
          if (!item) return state;

          const newItems = state.items.filter((item) => item.id !== productId);
          const newSavedItems = [...state.savedItems, item];

          const subtotal = newItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          const shipping = subtotal > 100 ? 0 : 10;
          const total = subtotal + shipping - subtotal * state.discountAmount;

          return {
            items: newItems,
            savedItems: newSavedItems,
            subtotal,
            shipping,
            total,
          };
        });
      },

      moveToCart: (productId) => {
        set((state) => {
          const item = state.savedItems.find((item) => item.id === productId);
          if (!item) return state;

          const newSavedItems = state.savedItems.filter(
            (item) => item.id !== productId
          );
          const newItems = [...state.items, item];

          const subtotal = newItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          const shipping = subtotal > 100 ? 0 : 10;
          const total = subtotal + shipping - subtotal * state.discountAmount;

          return {
            savedItems: newSavedItems,
            items: newItems,
            subtotal,
            shipping,
            total,
          };
        });
      },

      applyDiscount: (code) => {
        set((state) => {
          const discount = DISCOUNT_CODES[code as keyof typeof DISCOUNT_CODES];
          if (!discount) return state;

          const discountAmount = discount;
          const total =
            state.subtotal + state.shipping - state.subtotal * discountAmount;

          return {
            discountCode: code,
            discountAmount,
            total,
          };
        });
      },

      removeDiscount: () => {
        set((state) => ({
          discountCode: null,
          discountAmount: 0,
          total: state.subtotal + state.shipping,
        }));
      },

      clearCart: () =>
        set({
          items: [],
          savedItems: [],
          discountCode: null,
          discountAmount: 0,
          subtotal: 0,
          shipping: 0,
          total: 0,
        }),
    }),
    {
      name: "cart-storage",
    }
  )
);
