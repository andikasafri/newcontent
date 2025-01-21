'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Product } from '@/lib/types';

// Define action types
type Action = 
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SAVE_FOR_LATER'; payload: number }
  | { type: 'MOVE_TO_CART'; payload: number }
  | { type: 'APPLY_DISCOUNT'; payload: string }
  | { type: 'REMOVE_DISCOUNT' };

// Define state type
interface State {
  cart: CartItem[];
  savedItems: CartItem[];
  discountCode: string | null;
  discountAmount: number;
  shipping: number;
  subtotal: number;
  total: number;
}

// Initial state
const initialState: State = {
  cart: [],
  savedItems: [],
  discountCode: null,
  discountAmount: 0,
  shipping: 0,
  subtotal: 0,
  total: 0,
};

// Create context
const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

// Reducer function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      const newCart = existingItem
        ? state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...state.cart, { ...action.payload, quantity: 1 }];
      
      const subtotal = calculateSubtotal(newCart);
      const shipping = calculateShipping(subtotal);
      const total = calculateTotal(subtotal, shipping, state.discountAmount);

      return {
        ...state,
        cart: newCart,
        subtotal,
        shipping,
        total,
      };
    }
    
    case 'REMOVE_FROM_CART': {
      const newCart = state.cart.filter(item => item.id !== action.payload);
      const subtotal = calculateSubtotal(newCart);
      const shipping = calculateShipping(subtotal);
      const total = calculateTotal(subtotal, shipping, state.discountAmount);

      return {
        ...state,
        cart: newCart,
        subtotal,
        shipping,
        total,
      };
    }

    case 'UPDATE_QUANTITY': {
      const newCart = state.cart.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const subtotal = calculateSubtotal(newCart);
      const shipping = calculateShipping(subtotal);
      const total = calculateTotal(subtotal, shipping, state.discountAmount);

      return {
        ...state,
        cart: newCart,
        subtotal,
        shipping,
        total,
      };
    }

    case 'SAVE_FOR_LATER': {
      const item = state.cart.find(item => item.id === action.payload);
      if (!item) return state;

      const newCart = state.cart.filter(item => item.id !== action.payload);
      const newSavedItems = [...state.savedItems, item];
      
      const subtotal = calculateSubtotal(newCart);
      const shipping = calculateShipping(subtotal);
      const total = calculateTotal(subtotal, shipping, state.discountAmount);

      return {
        ...state,
        cart: newCart,
        savedItems: newSavedItems,
        subtotal,
        shipping,
        total,
      };
    }

    case 'MOVE_TO_CART': {
      const item = state.savedItems.find(item => item.id === action.payload);
      if (!item) return state;

      const newSavedItems = state.savedItems.filter(item => item.id !== action.payload);
      const newCart = [...state.cart, item];
      
      const subtotal = calculateSubtotal(newCart);
      const shipping = calculateShipping(subtotal);
      const total = calculateTotal(subtotal, shipping, state.discountAmount);

      return {
        ...state,
        cart: newCart,
        savedItems: newSavedItems,
        subtotal,
        shipping,
        total,
      };
    }

    case 'APPLY_DISCOUNT': {
      const discountAmount = getDiscountAmount(action.payload);
      const total = calculateTotal(state.subtotal, state.shipping, discountAmount);

      return {
        ...state,
        discountCode: action.payload,
        discountAmount,
        total,
      };
    }

    case 'REMOVE_DISCOUNT': {
      const total = calculateTotal(state.subtotal, state.shipping, 0);

      return {
        ...state,
        discountCode: null,
        discountAmount: 0,
        total,
      };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
}

// Helper functions
function calculateSubtotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateShipping(subtotal: number): number {
  return subtotal > 100 ? 0 : 10;
}

function calculateTotal(subtotal: number, shipping: number, discountAmount: number): number {
  return subtotal + shipping - (subtotal * discountAmount);
}

function getDiscountAmount(code: string): number {
  const discounts: { [key: string]: number } = {
    'SAVE10': 0.1,
    'SAVE20': 0.2,
    'FREESHIP': 0,
  };
  return discounts[code] || 0;
}

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}