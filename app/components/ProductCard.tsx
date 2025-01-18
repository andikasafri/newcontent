"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import type { Product } from "../types";
import { useCartStore } from "../store/useCartStore";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addItem);

  return (
    <div className="border rounded-lg p-4">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square mb-4">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <h2 className="text-lg font-bold">{product.title}</h2>
        <p className="text-gray-600 line-clamp-2">{product.description}</p>
        <p className="text-lg font-semibold mt-2">${product.price}</p>
      </Link>
      <button
        onClick={() => addToCart(product)}
        className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
      >
        <ShoppingCart className="h-5 w-5" />
        <span>Add to Cart</span>
      </button>
    </div>
  );
}