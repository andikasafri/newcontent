'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: number[];
  addItem: (productId: number) => void;
  removeItem: (productId: number) => void;
  hasItem: (productId: number) => boolean;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) => {
        set((state) => ({
          items: [...state.items, productId],
        }));
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        }));
      },
      hasItem: (productId) => {
        return get().items.includes(productId);
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);