import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/types';

interface CartItem extends Product {
  quantity: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'SAVE_FOR_LATER'; payload: number }
  | { type: 'MOVE_TO_CART'; payload: number }
  | { type: 'APPLY_DISCOUNT'; payload: string }
  | { type: 'REMOVE_DISCOUNT' }
  | { type: 'CLEAR_CART' };

interface CartState {
  items: CartItem[];
  savedItems: CartItem[];
  discountCode: string | null;
  discountAmount: number;
  shipping: number;
  subtotal: number;
  total: number;
}

const DISCOUNT_CODES = {
  SAVE10: 0.1,
  SAVE20: 0.2,
  FREESHIP: 0,
} as const;

function calculateTotals(items: CartItem[], discountAmount: number = 0): Pick<CartState, 'subtotal' | 'shipping' | 'total'> {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping - (subtotal * discountAmount);
  return { subtotal, shipping, total };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      const newItems = existingItem
        ? state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...state.items, { ...action.payload, quantity: 1 }];

      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems, state.discountAmount),
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems, state.discountAmount),
      };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems, state.discountAmount),
      };
    }

    case 'SAVE_FOR_LATER': {
      const item = state.items.find(item => item.id === action.payload);
      if (!item) return state;

      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        savedItems: [...state.savedItems, item],
        ...calculateTotals(newItems, state.discountAmount),
      };
    }

    case 'MOVE_TO_CART': {
      const item = state.savedItems.find(item => item.id === action.payload);
      if (!item) return state;

      const newSavedItems = state.savedItems.filter(item => item.id !== action.payload);
      const newItems = [...state.items, item];
      return {
        ...state,
        items: newItems,
        savedItems: newSavedItems,
        ...calculateTotals(newItems, state.discountAmount),
      };
    }

    case 'APPLY_DISCOUNT': {
      const discountAmount = DISCOUNT_CODES[action.payload as keyof typeof DISCOUNT_CODES] || 0;
      return {
        ...state,
        discountCode: action.payload,
        discountAmount,
        ...calculateTotals(state.items, discountAmount),
      };
    }

    case 'REMOVE_DISCOUNT': {
      return {
        ...state,
        discountCode: null,
        discountAmount: 0,
        ...calculateTotals(state.items, 0),
      };
    }

    case 'CLEAR_CART': {
      return {
        items: [],
        savedItems: [],
        discountCode: null,
        discountAmount: 0,
        shipping: 0,
        subtotal: 0,
        total: 0,
      };
    }

    default:
      return state;
  }
}

export const useCart = create<
  CartState & {
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    saveForLater: (productId: number) => void;
    moveToCart: (productId: number) => void;
    applyDiscount: (code: string) => void;
    removeDiscount: () => void;
    clearCart: () => void;
  }
>()(
  persist(
    (set) => ({
      items: [],
      savedItems: [],
      discountCode: null,
      discountAmount: 0,
      shipping: 0,
      subtotal: 0,
      total: 0,

      addItem: (product) =>
        set((state) => cartReducer(state, { type: 'ADD_ITEM', payload: product })),

      removeItem: (productId) =>
        set((state) => cartReducer(state, { type: 'REMOVE_ITEM', payload: productId })),

      updateQuantity: (productId, quantity) =>
        set((state) =>
          cartReducer(state, { type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } })
        ),

      saveForLater: (productId) =>
        set((state) => cartReducer(state, { type: 'SAVE_FOR_LATER', payload: productId })),

      moveToCart: (productId) =>
        set((state) => cartReducer(state, { type: 'MOVE_TO_CART', payload: productId })),

      applyDiscount: (code) =>
        set((state) => cartReducer(state, { type: 'APPLY_DISCOUNT', payload: code })),

      removeDiscount: () =>
        set((state) => cartReducer(state, { type: 'REMOVE_DISCOUNT' })),

      clearCart: () =>
        set((state) => cartReducer(state, { type: 'CLEAR_CART' })),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        savedItems: state.savedItems,
        discountCode: state.discountCode,
        discountAmount: state.discountAmount,
      }),
    }
  )
);