'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/types';

interface WishlistState {
  items: number[];
  addItem: (productId: number) => void;
  removeItem: (productId: number) => void;
  hasItem: (productId: number) => boolean;
  toggleItem: (productId: number) => void;
  clear: () => void;
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
      
      toggleItem: (productId) => {
        const hasItem = get().hasItem(productId);
        if (hasItem) {
          get().removeItem(productId);
        } else {
          get().addItem(productId);
        }
      },
      
      clear: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);