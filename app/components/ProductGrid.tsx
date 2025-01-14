import { Product } from "../types";
import ProductCard from "./ProductCard";
import { LoadingSpinner } from "./LoadingSpinner";

interface ProductGridProps {
  /** Array of products to display */
  products: Product[] | undefined;
  /** Loading state indicator */
  isLoading: boolean;
}

/**
 * Grid layout for displaying multiple product cards
 * Handles loading states and empty product lists
 *
 * @component
 * @example
 * ```tsx
 * <ProductGrid products={products} isLoading={isLoading} />
 * ```
 */
export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!products?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      role="grid"
      aria-label="Products grid"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
