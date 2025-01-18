"use client";

import { useState } from "react";
import { useCartStore } from "../../store/useCartStore";
import { ShoppingCart } from "lucide-react";
import { Product } from "../../types";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="aspect-w-1 aspect-h-1">
          <img
            src={product.images[selectedImage]}
            alt={product.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {product.images.map((image: string, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative rounded-lg overflow-hidden ${
                selectedImage === index ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <img
                src={image}
                alt={`${product.title} ${index + 1}`}
                className="w-full h-24 object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
        <p className="text-xl font-bold text-gray-900">${product.price}</p>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="text-gray-600">{product.description}</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Category</h2>
          <p className="text-gray-600">{product.category.name}</p>
        </div>
        <button
          onClick={() => addItem(product)}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}