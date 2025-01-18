"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getCategories } from "./lib/api";
import ProductCard from "./components/ProductCard";
import { ShoppingBag } from "lucide-react";
import ContainerScroll from "./components/ContainerScroll";
import { SplitText } from "./components/SplitText";
import { motion, AnimatePresence } from "framer-motion";
import { Category, Product } from "./types";
import Magnet from "./components/Magnet";
import { useState } from "react";

interface HomePageProps {
  initialData: {
    products: Product[];
    categories: Category[];
  };
}

export function HomePage({ initialData }: HomePageProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(0, 8),
    initialData: initialData.products,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    initialData: initialData.categories,
  });

  return (
    <div className="pt-16">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center max-w-4xl mx-auto px-4">
          <button onClick={() => setVisible(!visible)}>Toggle</button>
          <AnimatePresence>
            {visible && (
              <motion.div>
                <SplitText>Welcome to ShopHub</SplitText>
              </motion.div>
            )}
          </AnimatePresence>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. Start your shopping
            journey with us today.
          </p>
          <Magnet padding={50} magnetStrength={30}>
            <button
              onClick={() => router.push("/products")}
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
              onClick={() => router.push("/products")}
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

      <motion.div
        initial="hidden"
        animate="visible"
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
    </div>
  );
}