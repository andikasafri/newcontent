'use client';

import { AuthProvider } from '@/lib/contexts/auth-context';
import { CartProvider } from '@/lib/contexts/cart-context';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
}