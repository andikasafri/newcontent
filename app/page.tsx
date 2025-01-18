import { Suspense } from "react";
import { HomePage } from "./HomePage";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { getProducts, getCategories } from "./lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to ShopHub - Your One-Stop Shop for Amazing Products",
};

export const revalidate = 3600; // Revalidate every hour

async function getInitialData() {
  try {
    const [products, categories] = await Promise.all([
      getProducts(0, 8),
      getCategories(),
    ]);
    return { products, categories };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return { products: [], categories: [] };
  }
}

export default async function Page() {
  const initialData = await getInitialData();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomePage initialData={initialData} />
    </Suspense>
  );
}