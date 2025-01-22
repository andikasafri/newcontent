'use client';

import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { Product, CartItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface CartState {
  items: CartItem[];
  savedItems: CartItem[];
  discountCode: string | null;
  discountAmount: number;
  shipping: number;
  subtotal: number;
  total: number;
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

interface CartContextType extends CartState {
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  saveForLater: (productId: number) => void;
  moveToCart: (productId: number) => void;
  applyDiscount: (code: string) => void;
  removeDiscount: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const DISCOUNT_CODES: Record<string, number> = {
  SAVE10: 0.1,
  SAVE20: 0.2,
  FREESHIP: 0,
};

const initialState: CartState = {
  items: [],
  savedItems: [],
  discountCode: null,
  discountAmount: 0,
  shipping: 0,
  subtotal: 0,
  total: 0,
};

const STORAGE_KEY = 'cart-state';

// Load initial state from localStorage
const loadInitialState = (): CartState => {
  if (typeof window === 'undefined') return initialState;
  
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : initialState;
  } catch (error) {
    console.error('Failed to load cart state:', error);
    return initialState;
  }
};

function calculateTotals(items: CartItem[]): Pick<CartState, 'subtotal' | 'shipping' | 'total'> {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;
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
        ...calculateTotals(newItems),
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems),
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
        ...calculateTotals(newItems),
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
        ...calculateTotals(newItems),
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
        ...calculateTotals(newItems),
      };
    }

    case 'APPLY_DISCOUNT': {
      const discountAmount = DISCOUNT_CODES[action.payload] || 0;
      const total = state.subtotal + state.shipping - (state.subtotal * discountAmount);
      return {
        ...state,
        discountCode: action.payload,
        discountAmount,
        total,
      };
    }

    case 'REMOVE_DISCOUNT': {
      return {
        ...state,
        discountCode: null,
        discountAmount: 0,
        total: state.subtotal + state.shipping,
      };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, null, loadInitialState);
  const { toast } = useToast();

  // Persist state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save cart state:', error);
    }
  }, [state]);

  const addItem = useCallback((product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  }, []);

  const removeItem = useCallback((productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  }, []);

  const saveForLater = useCallback((productId: number) => {
    dispatch({ type: 'SAVE_FOR_LATER', payload: productId });
  }, []);

  const moveToCart = useCallback((productId: number) => {
    dispatch({ type: 'MOVE_TO_CART', payload: productId });
  }, []);

  const applyDiscount = useCallback((code: string) => {
    if (!DISCOUNT_CODES[code]) {
      toast({
        variant: 'destructive',
        description: 'Invalid discount code',
      });
      return;
    }
    dispatch({ type: 'APPLY_DISCOUNT', payload: code });
  }, [toast]);

  const removeDiscount = useCallback(() => {
    dispatch({ type: 'REMOVE_DISCOUNT' });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        saveForLater,
        moveToCart,
        applyDiscount,
        removeDiscount,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}