"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getCategories } from "../lib/api";
import { ProductGrid } from "../components/ProductGrid";
import { Pagination } from "../components/Pagination";
import { Search } from "lucide-react";
import type { Category, Product } from "../types";

const ITEMS_PER_PAGE = 12;

interface ProductsClientProps {
  initialData: {
    products: Product[];
    categories: Category[];
  };
}

export function ProductsClient({ initialData }: ProductsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(0, 100),
    initialData: initialData.products,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    initialData: initialData.categories,
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product: Product) => {
      const matchesCategory = selectedCategory
        ? product.category.id === selectedCategory
        : true;
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
          <button
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === null
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories?.map((category: Category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <ProductGrid products={paginatedProducts} isLoading={false} />

      {filteredProducts.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}