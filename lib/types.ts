// Add new types for cart improvements
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
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: number;
  size?: string;
  color?: string;
  stock: number;
  price?: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: ProductVariant;
  giftWrap?: boolean;
  estimatedDelivery?: string;
}

export interface CartState {
  items: CartItem[];
  savedItems: CartItem[];
  selectedItems: number[];
  discountCode: string | null;
  discountAmount: number;
  shipping: number;
  subtotal: number;
  total: number;
  giftWrapFee: number;
}

// ... rest of the types remain unchanged