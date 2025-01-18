import { Suspense } from "react";
import { ProductsClient } from "./ProductsClient";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { getProducts, getCategories } from "../lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our collection of amazing products",
};

export const revalidate = 3600; // Revalidate every hour

async function getInitialData() {
  const [products, categories] = await Promise.all([
    getProducts(0, 12),
    getCategories(),
  ]);
  return { products, categories };
}

export default async function ProductsPage() {
  const initialData = await getInitialData();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductsClient initialData={initialData} />
    </Suspense>
  );
}