"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * State structure for the wishlist.
 */
interface WishlistState {
  items: number[]; // Array of product IDs in the wishlist.
  addItem: (productId: number) => void; // Function to add a product ID to the wishlist.
  removeItem: (productId: number) => void; // Function to remove a product ID from the wishlist.
  hasItem: (productId: number) => boolean; // Function to check if a product ID is in the wishlist.
}

/**
 * Custom hook for managing a wishlist using Zustand.
 */
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
      name: "wishlist-storage",
    }
  )
);
