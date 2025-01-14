import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getProducts, getCategories } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { ShoppingBag } from "lucide-react";
import { ContainerScroll } from "../components/ContainerScroll";
import SplitText from "../components/SplitText";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Category, Product } from "../types";
import Magnet from "../components/Magnet";
import Loader from "../components/Loader";
import { useState, useEffect } from "react";

/**
 * Home page component with featured products and categories
 * Includes loading state, animations, and magnetic buttons
 *
 * @component
 */
export default function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(0, 8),
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Animation variants
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (productsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center max-w-4xl mx-auto px-4">
          <SplitText
            text="Welcome to ShopHub"
            className="text-6xl font-bold text-gray-900 mb-6"
            delay={150}
          />
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. Start your shopping
            journey with us today.
          </p>
          <Magnet padding={50} magnetStrength={30}>
            <button
              onClick={() => navigate("/products")}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold 
                flex items-center space-x-2 mx-auto hover:bg-blue-700 
                transition-colors transform hover:scale-105"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Shop Now</span>
            </button>
          </Magnet>
        </div>
      </div>

      {/* Categories Section */}
      <ContainerScroll
        titleComponent={
          <h2 className="text-4xl font-bold text-center mb-8">
            Shop by Category
          </h2>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories?.slice(0, 4).map((category: Category) => (
            <div
              key={category.id}
              className="relative rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => navigate("/products")}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-xl font-semibold">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </ContainerScroll>

      {/* Featured Products Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        className="bg-gray-50 py-10"
      >
        <h2 className="text-4xl font-bold text-center mb-8">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}
