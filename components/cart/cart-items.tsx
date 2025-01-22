'use client';

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { memo } from "react";

function CartItems() {
  const { items, updateQuantity, removeItem, saveForLater } = useCart();
  const { toast } = useToast();

  const handleQuantityUpdate = async (productId: number, newQuantity: number) => {
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

  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cart Items</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
            <Link
              href={`/product/${item.id}`}
              className="w-24 h-24 relative rounded-md overflow-hidden shrink-0"
            >
              <Image
                src={item.images[0]}
                alt={item.title}
                className="object-cover"
                fill
                sizes="96px"
                loading="lazy"
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
                <div className="ml-auto flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => saveForLater(item.id)}
                    title="Save for later"
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => removeItem(item.id)}
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
  );
}

export default memo(CartItems);