import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from './types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          const newItems = existingItem
            ? state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            : [...state.items, { ...product, quantity: 1 }];
          
          return { 
            items: newItems,
            total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          };
        });
      },
      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== productId);
          return { 
            items: newItems,
            total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          };
        });
      },
      updateQuantity: (productId, quantity) => {
        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          );
          return { 
            items: newItems,
            total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          };
        });
      },
      clearCart: () => set({ items: [], total: 0 }),
      total: 0,
    }),
    {
      name: 'cart-storage',
    }
  )
);