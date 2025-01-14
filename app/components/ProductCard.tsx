import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Product } from "../types";
import { useCartStore } from "../store/useCartStore";

interface ProductCardProps {
  /** Product data to display */
  product: Product;
}

/**
 * Product card component displaying product information
 * Includes image, title, description, price, and add to cart functionality
 *
 * @component
 * @example
 * ```tsx
 * <ProductCard product={productData} />
 * ```
 */
export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      </Link>
      <div className="p-4">
        <Link
          to={`/products/${product.id}`}
          className="text-lg font-semibold text-gray-800 hover:text-gray-900"
        >
          {product.title}
        </Link>
        <p className="mt-2 text-gray-600 text-sm line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ${product.price}
          </span>
          <button
            onClick={() => addItem(product)}
            className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </article>
  );
}
