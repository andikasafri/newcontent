'use client';

import { useCart } from '@/lib/cart';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const { toast } = useToast();

  const handleQuantityUpdate = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      updateQuantity(productId, newQuantity);
      toast({
        description: "Cart updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update cart",
      });
    }
  };

  const handleRemoveItem = (productId: number) => {
    try {
      removeItem(productId);
      toast({
        description: "Item removed from cart",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to remove item",
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Add some products to your cart to continue shopping
        </p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <span className="text-muted-foreground">/</span>
        <span>Shopping Cart</span>
      </div>

      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-card p-4 rounded-lg shadow-sm"
            >
              <Link 
                href={`/product/${item.id}`}
                className="w-24 h-24 relative rounded-md overflow-hidden shrink-0"
              >
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link 
                  href={`/product/${item.id}`}
                  className="font-semibold hover:text-primary"
                >
                  {item.title}
                </Link>
                <p className="text-primary font-bold mt-1">${item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto text-destructive"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <Link href="/checkout">
            <Button className="w-full">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}