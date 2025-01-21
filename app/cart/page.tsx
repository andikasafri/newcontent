"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { Minus, Plus, Trash2, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const {
    items,
    savedItems,
    subtotal,
    shipping,
    total,
    discountCode,
    discountAmount,
    updateQuantity,
    removeItem,
    saveForLater,
    moveToCart,
    applyDiscount,
  } = useCart();
  const { toast } = useToast();
  const [discountCodeInput, setDiscountCodeInput] = useState("");

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

  const handleSaveForLater = (productId: number) => {
    try {
      saveForLater(productId);
      toast({
        description: "Item saved for later",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to save item",
      });
    }
  };

  const handleMoveToCart = (productId: number) => {
    try {
      moveToCart(productId);
      toast({
        description: "Item moved to cart",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to move item",
      });
    }
  };

  const handleApplyDiscount = () => {
    if (!discountCodeInput.trim()) {
      toast({
        variant: "destructive",
        description: "Please enter a discount code",
      });
      return;
    }

    try {
      applyDiscount(discountCodeInput);
      toast({
        description: "Discount applied successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Invalid discount code",
      });
    }
  };

  if (items.length === 0 && savedItems.length === 0) {
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
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Active Cart Items */}
          {items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Cart Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 border rounded-lg"
                  >
                    <Link
                      href={`/product/${item.id}`}
                      className="w-24 h-24 relative rounded-md overflow-hidden shrink-0"
                    >
                      <Image
                        src={item.images[0]}
                        alt={item.title}
                        className="object-cover"
                        fill
                        sizes="(max-width: 96px) 100vw, 96px"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.id}`}
                        className="font-semibold hover:text-primary"
                      >
                        {item.title}
                      </Link>
                      <p className="text-primary font-bold mt-1">
                        ${item.price}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleQuantityUpdate(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleQuantityUpdate(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <div className="ml-auto flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSaveForLater(item.id)}
                            title="Save for later"
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Saved Items */}
          {savedItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Saved for Later</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {savedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 border rounded-lg"
                  >
                    <Link
                      href={`/product/${item.id}`}
                      className="w-24 h-24 relative rounded-md overflow-hidden shrink-0"
                    >
                      <Image
                        src={item.images[0]}
                        alt={item.title}
                        className="object-cover"
                        fill
                        sizes="(max-width: 96px) 100vw, 96px"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.id}`}
                        className="font-semibold hover:text-primary"
                      >
                        {item.title}
                      </Link>
                      <p className="text-primary font-bold mt-1">
                        ${item.price}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          onClick={() => handleMoveToCart(item.id)}
                        >
                          Move to Cart
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
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping > 0 ? `$${shipping.toFixed(2)}` : "Free"}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${(subtotal * discountAmount).toFixed(2)}</span>
                  </div>
                )}
                <Separator className="my-4" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Discount Code */}
              <div className="space-y-2">
                <Label htmlFor="discountCode">Discount Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="discountCode"
                    value={discountCodeInput}
                    onChange={(e) => setDiscountCodeInput(e.target.value)}
                    placeholder="Enter code"
                  />
                  <Button onClick={handleApplyDiscount}>Apply</Button>
                </div>
                {discountCode && (
                  <p className="text-sm text-green-600">
                    Code &ldquo;{discountCode}&rdquo; applied
                  </p>
                )}
              </div>

              <Link href="/checkout">
                <Button className="w-full" disabled={items.length === 0}>
                  Proceed to Checkout
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
