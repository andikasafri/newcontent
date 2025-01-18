import Link from "next/link"; // Updated import from next/link
import { ShoppingCart } from "lucide-react";
import { Product } from "../types";
import { useCartStore } from "../store/useCartStore";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCartStore();

  return (
    <div className="border rounded-lg p-4">
      <Link href={`/products/${product.id}`}>
        <h2 className="text-lg font-bold">{product.title}</h2>
        <p>{product.description}</p>
        <p>${product.price}</p>
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-auto"
        />
      </Link>
      <button
        onClick={() => addToCart(product)}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        <ShoppingCart /> Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;

//
