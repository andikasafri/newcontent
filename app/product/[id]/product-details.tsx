'use client';

import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    try {
      addItem(product);
      toast({
        description: "Added to cart successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to add to cart",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link 
          href={`/category/${product.category.id}`}
          className="text-muted-foreground hover:text-foreground"
        >
          {product.category.name}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span>{product.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <img
              src={product.images[0]}
              alt={product.title}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.slice(1).map((image, index) => (
              <div key={index} className="aspect-square relative overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={`${product.title} - ${index + 2}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-3xl font-bold text-primary mt-2">${product.price}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Category</h2>
            <Link 
              href={`/category/${product.category.id}`}
              className="text-primary hover:underline"
            >
              {product.category.name}
            </Link>
          </div>
          <Button size="lg" className="w-full" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}